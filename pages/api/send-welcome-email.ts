import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await rateLimit(req, res))) return;
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Missing email or name' });
  }
  const result = await sendWelcomeEmail(email, name);
 
  if (result.status) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ error: result.error, message: result.message });
  }
}
