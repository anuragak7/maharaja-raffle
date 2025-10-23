const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQ = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  
  if (!rec || rec.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  
  if (rec.count >= MAX_REQ) {
    return { allowed: false, retryAfter: Math.ceil((rec.resetAt - now) / 1000) };
  }
  
  rec.count += 1;
  return { allowed: true };
}