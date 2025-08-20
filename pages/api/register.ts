import type { NextApiRequest, NextApiResponse } from 'next';
import { saveUser } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { sendVerifyEmail } from '@/lib/verifyTemplate';
import { supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await rateLimit(req, res))) return;
  try {
    const user = req.body;
    // save user to supabase
    const supabaseAuthRes = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`
      }
    });

    if (supabaseAuthRes.error) {
      throw new Error(supabaseAuthRes.error.message || 'Registration failed');
    }

    if (supabaseAuthRes.data.user) {
      // Hash password on the server
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const data = await saveUser({ ...user, password: hashedPassword });
      // Defensive: ensure data is an array and first element is an object
      if (data == null) {
        // Send confirmation email
        // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        // const verifyUrl = `${baseUrl}/api/verify-email?token=${encodeURIComponent(user.email)}`;
        try {
          // await sendVerifyEmail(user.email, verifyUrl);
        } catch (emailErr) {
          // Optionally log or handle email sending error
        }
        const { password, ...userWithoutPassword } = user as Record<string, any>;
        // Issue JWT token for immediate login
        const { signJwt } = await import('@/lib/jwt');
        const token = signJwt({ id: supabaseAuthRes.data.user.id, email: supabaseAuthRes.data.user.email, role: supabaseAuthRes.data.user.role });
        res.status(200).json({ user: userWithoutPassword, token });
      } 
    }

      
  } catch (error: any) {
    if (error.message.includes('duplicate')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}
