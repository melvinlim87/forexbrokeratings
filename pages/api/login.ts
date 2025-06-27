import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  try {
    // Fetch user with password hash
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password, country_code, mobileno, role, created_at')
      .eq('status', true)
      .eq('email', email)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('User not found');
    }
  
    console.log('checking data', data)

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const { password: _pw, ...userWithoutPassword } = data;

    res.status(200).json({ user: userWithoutPassword });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
}
