import type { NextApiRequest, NextApiResponse } from 'next';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';

// export const runtime = "nodejs"; // 👈 force Node.js runtime

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let ip = requestIp.getClientIp(req);

    if (!ip || ip === '::1' || ip === '127.0.0.1') {
        ip = '8.8.8.8'; // Google DNS as example
    }

    const geo = geoip.lookup(ip);

    console.log('inside geo api', ip);
    console.log('inside geo api', geo);

    return res.status(200).json({
        ip,
        country: geo?.country ?? null,
    });
}

// export async function GET(req: Request) {
//   const ip = requestIp.getClientIp({ headers: Object.fromEntries(req.headers) }) || '127.0.0.1';
//   console.log('inside geo api', ip)
//   const geo = geoip.lookup(ip);
//   console.log('inside geo api', geo)
//   return NextResponse.json({
//     ip,
//     country: geo?.country ?? null,
//   });
// }