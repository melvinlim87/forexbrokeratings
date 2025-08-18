import type { NextApiRequest, NextApiResponse } from 'next';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';

// export const runtime = "nodejs"; // 👈 force Node.js runtime

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let ip = requestIp.getClientIp(req);

    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.0.0.1')) {
        ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || null;
    }

    // Fallback if still no IP (use Google DNS for dev)
    if (!ip) ip = '8.8.8.8';

    const geo = geoip.lookup(ip);

    return res.status(200).json({
        ip,
        country: geo?.country ?? null,
    });
}
