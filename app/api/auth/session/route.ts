import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!!'
);

export async function createToken(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setJti(nanoid())
		.setIssuedAt()
		.setExpirationTime('8h')
		.sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload;
	} catch (error) {
		return null;
	}
}

export async function getServerSession(req: NextRequest) {
	const token = req.cookies.get('auth-token')?.value;
	if (!token) return null;
	return await verifyToken(token);
}

export async function updateSession(req: NextRequest, res: NextResponse) {
	const token = req.cookies.get('auth-token')?.value;
	if (!token) return null;

	const verified = await verifyToken(token);
	if (!verified) return null;

	const tokenExp = verified.exp as number;
	const nowInSecs = Math.floor(Date.now() / 1000);
	const TEN_MINUTES = 10 * 60;

	if (tokenExp - nowInSecs <= TEN_MINUTES) {
		const { exp, iat, ...payload } = verified;
		const newToken = await createToken(payload);
		res.cookies.set('auth-token', newToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 8 * 60 * 60,
		});
	}

	return res;
}

export async function POST(req: Request) {
	try {
		const cookies = req.headers.get('cookie') || '';
		const token = cookies.match(/auth-token=([^;]*)/)?.[1];
		if (!token) {
			return NextResponse.json(
				{ error: 'No token provided' },
				{ status: 401 }
			);
		}

		const verified = await verifyToken(token);
		if (!verified) {
			return NextResponse.json(
				{ error: 'Invalid token' },
				{ status: 401 }
			);
		}

		const tokenExp = verified.exp as number;
		const nowInSecs = Math.floor(Date.now() / 1000);
		const TEN_MINUTES = 10 * 60;

		if (tokenExp - nowInSecs <= TEN_MINUTES) {
			const { exp, iat, ...payload } = verified;
			const newToken = await createToken(payload);

			const response = NextResponse.json({ message: 'Session updated' });
			response.cookies.set('auth-token', newToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 8 * 60 * 60,
			});

			return response;
		}

		return NextResponse.json({ message: 'Session still valid' });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || 'Failed to update session' },
			{ status: 500 }
		);
	}
}
