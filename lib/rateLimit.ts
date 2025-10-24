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
    points: 10000, // default: 10k requests
    duration: 60, // per 60 seconds by IP
  });
}

// Cache configurable limiters by their options to avoid recreating per request
const limiterCache = new Map<string, RateLimiterRedis>();

type RateLimitOptions = {
  keyPrefix?: string;
  points?: number;
  duration?: number;
  // Build a more specific key than IP to reduce false positives (e.g., IP+email on login)
  keyBuilder?: (req: NextApiRequest, ip: string) => string;
};

function getClientIp(req: NextApiRequest): string {
  const xfwd = (req.headers['x-forwarded-for'] as string) || '';
  const vercelFwd = (req.headers['x-vercel-forwarded-for'] as string) || '';
  const realIp = (req.headers['x-real-ip'] as string) || '';
  const cfIp = (req.headers['cf-connecting-ip'] as string) || '';
  const candidates = [realIp, cfIp, xfwd.split(',')[0]?.trim(), vercelFwd.split(',')[0]?.trim(), req.socket.remoteAddress || ''];
  const ip = candidates.find(Boolean) || '';
  return ip;
}

export async function rateLimit(req: NextApiRequest, res: NextApiResponse, opts: RateLimitOptions = {}) {
  // Temporary kill-switch for live incidents or maintenance
  if (process.env.RATE_LIMIT_DISABLED === 'true') return true;
  // No Redis configured: allow all
  if (!hasRedis || !rateLimiter) return true;

  const keyPrefix = opts.keyPrefix || 'middleware';
  const points = typeof opts.points === 'number' ? opts.points : 10000;
  const duration = typeof opts.duration === 'number' ? opts.duration : 60;

  // Create/retrieve a limiter for this option set
  const envPrefix = `${process.env.VERCEL_ENV || process.env.NODE_ENV || 'dev'}`;
  const cacheKey = `${envPrefix}:${keyPrefix}:${points}:${duration}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new RateLimiterRedis({
      storeClient: redisClient as Redis,
      keyPrefix: `${envPrefix}:${keyPrefix}`,
      points,
      duration,
    });
    limiterCache.set(cacheKey, limiter);
  }

  try {
    // Build consumer key
    const ip = getClientIp(req);
    const consumeKey = opts.keyBuilder ? opts.keyBuilder(req, ip) : ip;
    await limiter.consume(consumeKey);
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
