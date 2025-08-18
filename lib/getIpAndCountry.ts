import requestIp from 'request-ip';
import geoip from 'geoip-lite';

export async function getIpAndCountry(req: any) {
  // Get IP address from request
  const ip = await requestIp.getClientIp(req) || '0.0.0.0';

  // Lookup country from IP
  const geo = await geoip.lookup(ip);
  const country = geo?.country || 'Unknown';

  return { ip, country };
}
