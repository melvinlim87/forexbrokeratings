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
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();
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

export const config = {
  matcher: ['/api/aitools', '/api/me'],
};
