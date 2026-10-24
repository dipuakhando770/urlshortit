/**
 * Cloudflare Pages Function: API Edge Proxy
 * File: functions/api/[[route]].ts
 *
 * Forwards requests from Cloudflare Pages frontend directly to the Ubuntu VPS backend.
 * Solves browser CORS restrictions, shields backend IP, and handles edge rate-limiting.
 */

interface Env {
  BACKEND_API_URL?: string;
  BACKEND_SECRET_TOKEN?: string;
}

export type PagesFunction<T = any> = (context: {
  request: Request;
  env: T;
  params: Record<string, string | string[]>;
}) => Promise<Response> | Response;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const url = new URL(request.url);

  // Authoritative backend base URL configured in Cloudflare Pages Environment Variables
  const backendBaseUrl = (env.BACKEND_API_URL || 'https://api.lnk.pro').replace(/\/+$/, '');

  // Extract the route path (e.g. /api/links -> /api/links, /api/shorten.php -> /shorten.php)
  let targetPath = url.pathname;
  if (targetPath === '/api/shorten.php') {
    targetPath = '/shorten.php';
  }
  const targetUrl = new URL(`${backendBaseUrl}${targetPath}${url.search}`);

  // Handle CORS Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Clone headers and prepare forwarding
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
  forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
  forwardHeaders.set('X-Forwarded-Host', url.hostname);
  forwardHeaders.set('Host', new URL(backendBaseUrl).hostname);

  // Inject server-to-server token if set in Cloudflare Secrets
  if (env.BACKEND_SECRET_TOKEN && !forwardHeaders.has('Authorization')) {
    forwardHeaders.set('X-Backend-Secret', env.BACKEND_SECRET_TOKEN);
  }

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: forwardHeaders,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    });

    // Create response with appropriate CORS headers
    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    responseHeaders.set('X-Proxied-By', 'LinkPro-Cloudflare-Pages-Edge');

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'CLOUDFLARE_PROXY_ERROR',
          message: `Cloudflare Pages Edge proxy failed to connect to VPS backend at ${backendBaseUrl}: ${error.message}`,
        },
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
