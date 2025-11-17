const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://lionellite.alwaysdata.net',
      changeOrigin: true,
      // If the remote has an invalid/self-signed cert, set secure: false
      secure: true,
      logLevel: 'debug',
      pathRewrite: { '^/api': '/api' }
    })
  );
};
