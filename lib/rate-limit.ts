import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
    });
  }

  return ratelimit;
}

export async function checkContactRateLimit(
  identifier: string,
): Promise<{ success: boolean; limitConfigured: boolean }> {
  const limiter = getRatelimit();

  if (!limiter) {
    return { success: true, limitConfigured: false };
  }

  const result = await limiter.limit(identifier);
  return { success: result.success, limitConfigured: true };
}
