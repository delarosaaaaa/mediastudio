import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on cold start — fine for internal use)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now    = Date.now();
  const window = 60_000; // 1 minute
  const limit  = 15;     // requests per minute

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Rate limit analyze API
  if (path.startsWith("/api/analyze")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return new NextResponse("Too many requests. Please wait a moment.", { status: 429 });
    }
  }

  // Protect dashboard with Basic auth
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
