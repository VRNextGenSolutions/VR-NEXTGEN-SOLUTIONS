/**
 * Simple in-memory rate limiter.
 * NOTE: For multi-instance deployments replace with a shared store like Redis.
 */

const MAX_SUBMISSIONS = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5);
const WINDOW_MS =
  Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000);

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string) {
  if (!identifier) return { allowed: true, remaining: MAX_SUBMISSIONS };

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.expiresAt <= now) {
    store.set(identifier, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });

    return { allowed: true, remaining: MAX_SUBMISSIONS - 1 };
  }

  if (entry.count >= MAX_SUBMISSIONS) {
    return { allowed: false, retryAfter: entry.expiresAt - now };
  }

  entry.count += 1;
  store.set(identifier, entry);

  return { allowed: true, remaining: MAX_SUBMISSIONS - entry.count };
}

export function purgeExpiredRates() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt <= now) {
      store.delete(key);
    }
  }
}

