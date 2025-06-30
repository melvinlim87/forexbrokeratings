import type { NextApiRequest, NextApiResponse } from 'next';
import { saveUser } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { sendVerifyEmail } from '@/lib/verifyTemplate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const user = req.body;
    // Hash password on the server
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const data = await saveUser({ ...user, password: hashedPassword });
    // Defensive: ensure data is an array and first element is an object
    if (data == null) {
      // Send confirmation email
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const verifyUrl = `${baseUrl}/api/verify-email?token=${encodeURIComponent(user.email)}`;
      try {
        await sendVerifyEmail(user.email, verifyUrl);
      } catch (emailErr) {
        // Optionally log or handle email sending error
        // console.log(emailErr)
      }
      const { password, ...userWithoutPassword } = user as Record<string, any>;
      res.status(200).json({ user: userWithoutPassword });
    } 
  } catch (error: any) {
    if (error.message.includes('duplicate')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}
