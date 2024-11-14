import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
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

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  const verified = await verifyToken(token);
  if (!verified) return null;

  // Refresh token if it's close to expiry
  const tokenExp = verified.exp as number;
  const nowInSecs = Math.floor(Date.now() / 1000);
  const TEN_MINUTES = 10 * 60;

  if (tokenExp - nowInSecs <= TEN_MINUTES) {
    const { exp, iat, ...payload } = verified;
    const newToken = await createToken(payload);
    
    const response = NextResponse.next();
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
    });
    
    return response;
  }

  return NextResponse.next();
}