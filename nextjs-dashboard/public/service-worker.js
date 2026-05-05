// public/service-worker.js
self.addEventListener('install', event => {
  console.log('Service Worker installed 🚀');
});

self.addEventListener('push', event => {
  const data = event.data?.json();
  const title = data?.title || 'Recital Radar 🎶';
  const options = {
    body: data?.body || '¡Hay una nueva oferta disponible!',
    icon: '/icons/icon-192x192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

