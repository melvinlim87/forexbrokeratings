import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL as string);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 200, // 200 requests
  duration: 60, // per 60 seconds by IP
});

export async function rateLimit(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get IP address (works for Vercel, local, and most proxies)
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '';
    await rateLimiter.consume(ip);
    return true;
  } catch (err) {
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }
}
