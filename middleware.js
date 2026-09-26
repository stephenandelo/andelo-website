/**
 * Preview deployments on *.vercel.app get noindex. Production custom domain is unchanged.
 */
import { next } from '@vercel/edge';

function isVercelAppHost(hostname) {
  return hostname.endsWith('.vercel.app');
}

export default function middleware(request) {
  const hostname = request.headers.get('host')?.split(':')[0] ?? '';

  if (!isVercelAppHost(hostname)) {
    return next();
  }

  return next({
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  matcher: '/:path*',
};
