import { Redis } from 'ioredis';

const redis = new Redis({
	host: process.env.REDIS_URL || 'localhost', // Redis host
	port: process.env.REDIS_PORT || 6379, // Redis port (default: 6379)
	db: process.env.REDIS_DB || 0, // Redis DB (default: 0)
});

// Rate limiter configuration: 5 requests per minute
const MAX_REQUESTS = 10;
const WINDOW_TIME = 60; // in seconds (1 minute)

export async function checkRateLimit(identifier: string) {
	// Get the current count of requests for the identifier
	const currentRequests = await redis.get(identifier);

	if (currentRequests) {
		// If the identifier has exceeded the max requests, deny the request
		if (parseInt(currentRequests) >= MAX_REQUESTS) {
			return {
				success: false,
				message: 'Rate limit exceeded. Please try again later.',
				remaining: 0,
				reset: Date.now() + WINDOW_TIME * 1000, // Reset time in ms
			};
		}
	} else {
		// If the identifier doesn't exist, initialize with 0
		await redis.set(identifier, 0, 'EX', WINDOW_TIME); // Set TTL for the key
	}

	// Increment the request count for the identifier
	const newRequests = await redis.incr(identifier);

	if (newRequests > MAX_REQUESTS) {
		return {
			success: false,
			message: 'Rate limit exceeded. Please try again later.',
			remaining: 0,
			reset: Date.now() + WINDOW_TIME * 1000,
		};
	}

	const remaining = MAX_REQUESTS - newRequests;
	return {
		success: true,
		message: 'Request successful',
		remaining,
		reset: Date.now() + WINDOW_TIME * 1000, // Reset time in ms
	};
}
