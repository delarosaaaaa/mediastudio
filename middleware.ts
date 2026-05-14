import { NextRequest, NextResponse } from "next/server";

// ─── Rate limiter ─────────────────────────────────────────────
// In-memory per serverless instance. Resets on cold start — acceptable for this use case.
// Map entries are cleaned up on every check to prevent unbounded growth.

interface RateLimitEntry { count: number; resetAt: number; }
const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const LIMIT     = 15;     // requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Purge expired entries to prevent memory leak
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Middleware ───────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/analyze")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return new NextResponse("Too many requests. Please wait a moment.", { status: 429 });
    }
  }

  if (path.startsWith("/dashboard")) {
    const auth     = req.headers.get("authorization");
    const password = process.env.DASHBOARD_PASSWORD;
    if (!password) {
      return new NextResponse("DASHBOARD_PASSWORD not set.", { status: 500 });
    }
    const expected = `Basic ${Buffer.from(`admin:${password}`).toString("base64")}`;
    if (auth !== expected) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="MediaStudio Dashboard"' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/analyze/:path*", "/dashboard/:path*"],
};
