module.exports = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/your-domain\.vercel\.app\/api\/recitals/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'recitals-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hora
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Puedes agregar más patrones para otras APIs
  ],
};