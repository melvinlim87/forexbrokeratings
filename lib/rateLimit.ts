import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

// If REDIS_URL is not provided, disable rate limiting (useful for local/dev)
const hasRedis = Boolean(process.env.REDIS_URL);
let rateLimiter: RateLimiterRedis | null = null;
let redisClient: Redis | null = null;

if (hasRedis) {
  redisClient = new Redis(process.env.REDIS_URL as string);
  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 200, // 200 requests
    duration: 60, // per 60 seconds by IP
  });
}

export async function rateLimit(req: NextApiRequest, res: NextApiResponse) {
  // No Redis configured: allow all
  if (!hasRedis || !rateLimiter) return true;

  try {
    // Get IP address (works for Vercel, local, and most proxies)
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '';
    await rateLimiter.consume(ip);
    return true;
  } catch (err: any) {
    // If Redis is unreachable or errors in non-production, do not block
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Rate limit skipped due to error (dev):', err?.message || err);
      return true;
    }
    // Production: return 429 only for genuine rate limit exceed or hard errors
    try {
      res.status(429).json({ error: 'Too many requests' });
    } catch (_) {
      // ensure function returns false even if response already sent
    }
    return false;
  }
}
