import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, updateSession } from '@/lib/auth/auth';

const publicPaths = ['/login'];

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('auth-token')?.value;
	const session = token ? await verifyToken(token) : null;
	const { pathname } = request.nextUrl;

	// Check if the path is public
	if (publicPaths.includes(pathname)) {
		// Redirect to dashboard if already authenticated
		if (session) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		return NextResponse.next();
	}

	// Protected routes
	if (!session) {
		const redirectUrl = new URL('/login', request.url);
		redirectUrl.searchParams.set('from', pathname);
		return NextResponse.redirect(redirectUrl);
	}

	// Update session if needed (refresh token)
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api routes
		 * - static files (/_next, /images, /favicon.ico, etc.)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
