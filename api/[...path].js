// Vercel Serverless Function: catch-all proxy for /api/*
// For deployments on Vercel: requests to /api/<...> will be handled here
// and forwarded to the real API at https://lionellite.alwaysdata.net

const nodeFetch = require('node-fetch');

module.exports = async (req, res) => {
  // Determine allowed origin for CORS. Prefer environment variable in Vercel.
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://blog-ursule-e2u7.vercel.app';
  const allowCredentials = process.env.ALLOW_CREDENTIALS === 'true';

  // Set CORS headers. Use exact origin (not '*') when credentials are allowed or for better security.
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (allowCredentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Build target URL by removing the /api/ prefix
    const incoming = req.url || '';
    // incoming starts with /api/... (because this function is mounted under /api)
    const pathAndQuery = incoming.replace(/^\/api\/?/, '');
    const [pathPart, queryPart] = pathAndQuery.split('?');
    const targetBase = 'https://lionellite.alwaysdata.net/';
    const targetUrl = targetBase + (pathPart || '');
    const finalUrl = queryPart ? targetUrl + '?' + queryPart : targetUrl;

    // Collect request body if present
    let body = null;
    if (!['GET', 'HEAD'].includes(req.method)) {
      body = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });
    }

    // Build headers for the proxied request
    const proxiedHeaders = { ...req.headers };
    // Remove hop-by-hop / problematic headers
    delete proxiedHeaders['host'];
    delete proxiedHeaders['connection'];
    delete proxiedHeaders['content-length'];

  // Use global fetch (Node 18+ on Vercel). Fallback to node-fetch if necessary.
  const fetchImpl = (typeof global !== 'undefined' && global.fetch) ? global.fetch : nodeFetch;

    const fetchRes = await fetchImpl(finalUrl, {
      method: req.method,
      headers: proxiedHeaders,
      body: body && body.length ? body : undefined,
      // don't follow forever
      redirect: 'manual',
    });

    // Copy status and headers
    res.statusCode = fetchRes.status;
    fetchRes.headers.forEach((value, name) => {
      // don't forward hop-by-hop or CORS headers from the backend; we'll set our own
      const forbidden = ['transfer-encoding', 'content-encoding', 'access-control-allow-origin'];
      if (forbidden.includes(name)) return;
      res.setHeader(name, value);
    });

    // Ensure CORS header so browser accepts response (re-apply in case backend altered it)
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    const arrayBuffer = await fetchRes.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    res.statusCode = 500;
    res.end('Proxy error: ' + String(err && err.stack ? err.stack : err));
  }
};
