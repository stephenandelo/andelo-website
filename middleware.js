/**
 * Staging-only protections for the `staging` branch on Vercel.
 * Production (`main`) is untouched: normal robots.txt, no noindex, no auth.
 */
import { next } from '@vercel/edge';

const STAGING_BRANCH = 'staging';

function isStaging() {
  return process.env.VERCEL_GIT_COMMIT_REF === STAGING_BRANCH;
}

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Andelo Staging"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function checkBasicAuth(request) {
  const user = process.env.STAGING_USER;
  const pass = process.env.STAGING_PASSWORD;
  if (!user || !pass) {
    // Fail closed on staging if credentials are not configured.
    return false;
  }

  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;

  try {
    const decoded = atob(header.slice(6));
    const i = decoded.indexOf(':');
    if (i < 0) return false;
    const u = decoded.slice(0, i);
    const p = decoded.slice(i + 1);
    return u === user && p === pass;
  } catch {
    return false;
  }
}

export default function middleware(request) {
  if (!isStaging()) {
    return next();
  }

  if (!checkBasicAuth(request)) {
    return unauthorized();
  }

  const url = new URL(request.url);

  if (url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
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
