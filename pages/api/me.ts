import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For demo: just check for session cookie (customize as needed)
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session;

  if (session) {
    // In real app: lookup session in DB or decode session JWT
    // Here, just echo the session value as user (for demo)
    try {
      const user = JSON.parse(session);
      return res.status(200).json({ user });
    } catch {
      return res.status(401).json({ error: 'Invalid session' });
    }
  }
  return res.status(401).json({ error: 'Not authenticated' });
}
