import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { verifyJwt } from '@/lib/jwt';

export function withJwtAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization || req.cookies?.token;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }
    const payload = verifyJwt(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = payload;
    return handler(req, res);
  };
}
