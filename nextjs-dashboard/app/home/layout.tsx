import TopNav from '@/app/ui/home/topnav';
import ServiceWorker from '@/app/ui/home/serviceWorkerRegistration';
import ChatBot from '@/app/ui/chat/ChatBot';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#23232b] text-[#fff0f6] flex flex-col">
      <ServiceWorker />
      <TopNav />

      <div className="w-full bg-pink-200 text-[#23232b] text-center py-3 font-bold text-lg">
        Lets rock in Recitaly!
      </div>
      
      <main className="flex-grow p-6 md:p-12">{children}</main>
      
      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  );
}