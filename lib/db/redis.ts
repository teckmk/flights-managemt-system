import { createClient, RedisClientType } from 'redis';

const client: RedisClientType = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.connect();

export const cache = {
	set: (
		key: string,
		value: string,
		mode: string,
		duration: number
	): Promise<string | null> => {
		return client.set(key, value, mode, duration);
	},
	get: (key: string): Promise<string | null> => {
		return client.get(key);
	},
	del: (key: string): Promise<void> => {
		return client.del(key);
	},
};
