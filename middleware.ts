// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'forexbrokeratingyeah';

async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Protect API endpoints with JWT (existing behavior)
  if (pathname.startsWith('/api/')) {
    // 1a) Public API allowlist (no auth required)
    // Add public endpoints here to bypass JWT checks
    const publicApiPaths = [
      '/api/risk-on-risk-off/quotes',
      '/api/login',
    ];

    if (publicApiPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }

    if (req.method === 'OPTIONS') return NextResponse.next();

    const authHeader = req.headers.get('authorization');
    let token = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = req.cookies.get('token')?.value ?? null;
    }

    if (!token) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const payload = await verifyJwt(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    return NextResponse.next();
  }

  // 2) Locale-aware redirects and rewrites for non-API paths
  const LOCALES = ['en', 'zh'] as const;
  const localePattern = new RegExp(`^/(?:${LOCALES.join('|')})(?:/|$)`);

  // Skip static and special files
  const STATIC_PREFIXES = [
    '/_next',
    '/favicon.ico',
    '/icon',
    '/images',
    '/assets',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap',
    '/manifest.webmanifest',
  ];
  if (STATIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // a) If path already has locale prefix, rewrite to the underlying route without the prefix
  if (localePattern.test(pathname)) {
    const withoutLocale = pathname.replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
    const url = req.nextUrl.clone();
    url.pathname = withoutLocale;
    // Keep search/query
    url.search = search;
    return NextResponse.rewrite(url);
  }

  // b) If path has no locale, redirect to default '/en' prefixed URL
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = `/en${pathname}`;
  // Keep query string
  redirectUrl.search = search;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  // Match all paths to apply locale handling, but exclude Next internals explicitly in code above
  matcher: ['/((?!_next).*)'],
};
