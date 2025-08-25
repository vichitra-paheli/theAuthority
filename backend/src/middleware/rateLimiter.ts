import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  
  let entry = rateLimitStore.get(clientId);
  
  if (!entry) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(clientId, entry);
  } else if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
  } else {
    entry.count++;
  }
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
  res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  
  if (entry.count > maxRequests) {
    logger.warn(`Rate limit exceeded for IP: ${clientId}`, {
      ip: clientId,
      requests: entry.count,
      limit: maxRequests,
    });
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        retryAfter: entry.resetTime - now,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next();
};
