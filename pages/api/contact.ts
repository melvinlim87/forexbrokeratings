import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await rateLimit(req, res))) return;

  const { title, content, email } = req.body || {};

  if (!title || !content || !email) {
    return res.status(400).json({ error: 'Missing title, content or email' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const subject = `[Contact] ${title}`;
  const to = 'support@forexbrokeratings.com';
  const html = `
    <div>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${String(content).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
  `;
  const text = `From: ${email}\nTitle: ${title}\n\n${content}`;

  try {
    await sendEmail({ to, subject, html, text });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
