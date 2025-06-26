import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from '@/lib/emailTemplates';

export async function sendEmail({
  to,
  subject,
  html,
  text
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const tpl = welcomeEmailTemplate(name);
    await sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return { status: true, success: true };
  } catch (error) {
    return { status: false, error: 'Failed to send email', message: error instanceof Error ? error.message : String(error) };
  }
}
