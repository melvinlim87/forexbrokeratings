import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

// GET: /api/verify-email?token=... (token = user email, simple for now)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await rateLimit(req, res))) return;

  try {
    const verified_user = req.query.verified_user;
    const user = JSON.parse(decodeURIComponent(verified_user as string));
    const { signJwt } = await import('@/lib/jwt');
    const jwt_token = await signJwt({ id: user.id, email: user.email, role: user.role });
    // const userParam = encodeURIComponent(JSON.stringify(user));
    
    // Server-side redirect (not window.location.href!)
    res.writeHead(302, {
      Location: `/?verified=1&token=${jwt_token}`
    });
    res.end();
    return;
    // Optionally redirect to a success page
    // return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Verification failed le la' });
  }
}
