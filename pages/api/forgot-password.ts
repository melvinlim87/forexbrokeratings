import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.origin || process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
    if (error) throw error;
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to send reset email' });
  }
}
