import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  try {
    // use supabase for login user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    // Fetch user with password hash
    // const { data, error } = await supabase
    //   .from('users')
    //   .select('id, name, email, password, country_code, mobileno, role, created_at, email_verified_at, status')
    //   .eq('email', email)
    //   .single();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('User not found');
    }
  
    if (data.user.user_metadata.status === false) {
      throw new Error('User not verified');
    }

    // Add JWT token
    const { signJwt } = await import('@/lib/jwt');
    const token = signJwt({ id: data.user.id, email: data.user.email, role: data.user.user_metadata.role });
    res.status(200).json({ user: data.user, token: token });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
}
