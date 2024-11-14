import { Redis } from 'ioredis';
import { logger } from '@/lib/utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisService {
  private static instance: Redis;
  private static isConnected: boolean = false;
  private static readonly RECONNECT_ATTEMPTS = 5;
  private static readonly RECONNECT_DELAY = 1000; // 1 second

  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis(REDIS_URL, {
        retryStrategy: (times) => {
          if (times > this.RECONNECT_ATTEMPTS) {
            logger.error('Max Redis reconnection attempts reached');
            return null;
          }
          return this.RECONNECT_DELAY;
        },
        maxRetriesPerRequest: 3,
      });

      this.setupEventHandlers();
    }
    return this.instance;
  }

  private static setupEventHandlers() {
    this.instance.on('connect', () => {
      this.isConnected = true;
      logger.info('Redis connected');
    });

    this.instance.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    this.instance.on('close', () => {
      this.isConnected = false;
      logger.warn('Redis connection closed');
    });

    this.instance.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });
  }

  static async publish(channel: string, message: any) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis is not connected');
      }
      
      const serializedMessage = typeof message === 'string' 
        ? message 
        : JSON.stringify(message);
        
      await this.instance.publish(channel, serializedMessage);
      logger.debug(`Published message to ${channel}:`, message);
    } catch (error) {
      logger.error(`Error publishing to ${channel}:`, error);
      throw error;
    }
  }
}

export const cache = RedisService.getInstance();