import { createHash, randomBytes } from 'crypto';
import { cache } from '@/lib/services/RedisService';

const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-key!!!';
const TOKEN_EXPIRY = 60 * 60; // 1 hour

export function generateCsrfToken(): string {
	const token = randomBytes(32).toString('hex');
	const hash = createHash('sha256')
		.update(`${token}${CSRF_SECRET}`)
		.digest('hex');

	// Store in Redis with expiry
	cache.set(`csrf:${token}`, hash, 'EX', TOKEN_EXPIRY);

	return token;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
	const storedHash = await cache.get(`csrf:${token}`);
	if (!storedHash) return false;

	const expectedHash = createHash('sha256')
		.update(`${token}${CSRF_SECRET}`)
		.digest('hex');

	return storedHash === expectedHash;
}
