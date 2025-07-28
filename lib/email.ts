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
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let res = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text,
    });
    console.log('checking send email resrs ',res)
    return res;
  } catch (error) {
    console.log('checking send email error ',error)
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const tpl = welcomeEmailTemplate(name);
    let res = await sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    console.log('check send email res',res)
    return { status: true, success: true };
  } catch (error) {
    return { status: false, error: 'Failed to send email', message: error instanceof Error ? error.message : String(error) };
  }
}
