const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://startradersindia.in', // VPS Backend URL
      changeOrigin: true,
    })
  );
};
