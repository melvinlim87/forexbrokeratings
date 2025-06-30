export function welcomeEmailTemplate(name: string) {
  return {
    subject: 'Welcome to ForexBrokeratings!',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;">
      <h2 style="color:#3266e3;">Welcome, ${name || 'Trader'}!</h2>
      <p>Thank you for subscribing to ForexBrokeratings. You’ll now receive the latest broker updates, promotions, and news straight to your inbox.</p>
      <p>If you have any questions, reply to this email or visit our website for more information.</p>
      <hr style="margin:24px 0;" />
      <p style="color:#888;font-size:12px;">You’re receiving this email because you subscribed to ForexBrokeratings.</p>
    </div>`,
    text: `Welcome, ${name || 'Trader'}!\n\nThank you for subscribing to ForexBrokeratings. You’ll now receive the latest broker updates, promotions, and news straight to your inbox.`
  };
}

export function verifyEmailTemplate(url: string) {
  return {
    subject: 'Verify your email address',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;">
      <h2 style="color:#3266e3;">Verify your email address</h2>
      <p>Thank you for registering in forexbrokeratings.com. Please confirm your email address by clicking the link below:</p>
      <p><a href="${url}" style="color:#2563eb;">Verify Email Address</a></p>
      <hr style="margin:24px 0;" />
      <p style="color:#888;font-size:12px;">You’re receiving this email because you registered in forexbrokeratings.com.</p>
    </div>`,
    text: `Thank you for registering in forexbrokeratings.com. Please confirm your email address by clicking the link below.`
  };
}

