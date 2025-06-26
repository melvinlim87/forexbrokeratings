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
