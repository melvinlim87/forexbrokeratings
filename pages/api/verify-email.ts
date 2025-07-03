import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

// GET: /api/verify-email?token=... (token = user email, simple for now)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Invalid or missing token' });
  }
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ email_verified_at: new Date().toISOString(), status: true })
      .eq('email', token)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove sensitive fields
    const { password, ...userWithoutPassword } = data[0];
    // Redirect to homepage with user info in query param
    const userParam = encodeURIComponent(JSON.stringify(userWithoutPassword));
    res.writeHead(302, { Location: `/?verified_user=${userParam}` });
    res.end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Verification failed' });
  }
}
