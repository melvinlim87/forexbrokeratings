import requestIp from 'request-ip';
import geoip from 'geoip-lite';
import { headers } from 'next/headers';

export function getIpAndCountry() {
  const incomingHeaders = headers();
  const ip =
    incomingHeaders.get('x-forwarded-for')?.split(',')[0] ||
    incomingHeaders.get('x-real-ip') ||
    '0.0.0.0';

  const geo = geoip.lookup(ip);
  const country = geo?.country || 'Unknown';

  return { ip, country };
}