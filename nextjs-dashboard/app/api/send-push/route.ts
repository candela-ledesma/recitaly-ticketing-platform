// app/api/send-push/route.ts
import { prisma } from '@/app/lib/prisma';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const { title, message } = await req.json();
  const subs = await prisma.pushSubscription.findMany();

  const payload = JSON.stringify({ title, body: message });

  await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(sub as any, payload).catch((err) => {
        console.error('❌ Failed to send notification:', err);
      })
    )
  );

  return new Response('Push notifications sent 🎉', { status: 200 });
}
