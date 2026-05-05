'use client';
import { useEffect } from 'react';

export default function PushSubscribe() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        if (permission !== 'granted') return;

        const existing = await registration.pushManager.getSubscription();
        
        if (existing){
          console.log('Existing subscription:', existing);
          return;
        } 

        const res = await fetch('/api/vapid-public-key');
        const { publicKey } = await res.json();
        console.log('Public key:', publicKey);
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        console.log('New subscription:', sub);
        await fetch('/api/save-subscription', {
          method: 'POST',
          body: JSON.stringify(sub),
        });
      });
    }

    function urlBase64ToUint8Array(base64String: string) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }
  }, []);

  return null;
}
