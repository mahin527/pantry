interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store: Record<string, RateLimitRecord> = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // 5 attempts per window

export const rateLimit = (
  identifier: string,
): { success: boolean; remaining: number; resetTime: number } => {
  const now = Date.now();
  const record = store[identifier];

  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetTime: now + WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    success: true,
    remaining: MAX_REQUESTS - record.count,
    resetTime: record.resetTime,
  };
};
