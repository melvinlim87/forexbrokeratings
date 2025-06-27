import type { NextApiRequest, NextApiResponse } from 'next';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dispatch = useDispatch();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // redux clear user
  dispatch(logout())
  res.status(200).json({ message: 'Logged out' });
}
