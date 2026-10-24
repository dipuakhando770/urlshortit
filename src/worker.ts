/**
 * Cloudflare Worker with Static Assets
 * Handles /api/* and /shorten.php proxy to Ubuntu VPS backend,
 * and falls back to static asset serving for the React SPA.
 */

interface Env {
  BACKEND_API_URL?: string;
  BACKEND_SECRET_TOKEN?: string;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Forward API and shorten.php requests to the authoritative VPS backend
    if (url.pathname.startsWith('/api/') || url.pathname === '/shorten.php') {
      const backendBaseUrl = (env.BACKEND_API_URL || 'https://api.lnk.pro').replace(/\/+$/, '');

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

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
      forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
      forwardHeaders.set('X-Forwarded-Host', url.hostname);
      forwardHeaders.set('Host', new URL(backendBaseUrl).hostname);

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

        const responseHeaders = new Headers(backendResponse.headers);
        responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        responseHeaders.set('X-Proxied-By', 'LinkPro-Cloudflare-Worker-Edge');

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
              message: `Cloudflare Worker Edge proxy failed to connect to VPS backend at ${backendBaseUrl}: ${error?.message || error}`,
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
    }

    // Serve static frontend assets for all other routes
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('LinkPro Frontend Static Assets Not Found', { status: 404 });
  },
};
