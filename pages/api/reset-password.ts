import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required' });
  try {
    // This endpoint expects the user to be authenticated via the reset link
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    res.status(200).json({ message: 'Password has been reset' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset password' });
  }
}
