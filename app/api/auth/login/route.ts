import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth/auth';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { validateCsrfToken } from '@/lib/auth/csrf';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyPassword } from '@/lib/utils/password';

export async function POST(request: NextRequest) {
	try {
		// Validate CSRF token
		const csrfToken = request.headers.get('csrf-token');
		if (!csrfToken || !validateCsrfToken(csrfToken)) {
			return NextResponse.json(
				{ message: 'Invalid CSRF token' },
				{ status: 403 }
			);
		}

		// Rate limiting
		const ip = request.ip || 'anonymous';
		const rateLimitResult = await checkRateLimit(ip);

		if (!rateLimitResult.success) {
			return NextResponse.json(
				{
					message: 'Too many login attempts. Please try again later.',
					reset: rateLimitResult.reset,
				},
				{ status: 429 }
			);
		}

		// Get request body
		const { email, password } = await request.json();

		// Connect to database
		await connectDB();

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Verify password
		const isValid = await verifyPassword(password, user.password);
		if (!isValid) {
			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Create session token
		const token = await createToken({
			id: user._id,
			email: user.email,
			role: user.role,
			name: user.name,
		});

		// Create response with redirect
		const response = NextResponse.json(
			{
				message: 'Logged in successfully',
				redirect: '/dashboard',
			},
			{ status: 200 }
		);

		// Set cookie
		response.cookies.set('auth-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 8 * 60 * 60, // 8 hours
		});

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || 'Internal server error' },
			{ status: 500 }
		);
	}
}
