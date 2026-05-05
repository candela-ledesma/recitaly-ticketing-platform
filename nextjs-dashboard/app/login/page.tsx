
import dynamic from 'next/dynamic';

const LoginForm = dynamic(
  () => import('../ui/login/LoginForm'),
  {
    
    // tiny low-cost placeholder while the client bundle loads
    loading: () => (
      <div className="w-full max-w-sm bg-[#2e2e38] rounded-xl shadow-lg p-8">
        <div className="h-6 bg-[#1f1f27] rounded mb-4 animate-pulse" />
        <div className="h-10 bg-[#1f1f27] rounded mb-2 animate-pulse" />
        <div className="h-10 bg-[#1f1f27] rounded mt-6 animate-pulse" />
      </div>
    ),
  }
);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e26]">
      <div className="w-full max-w-sm bg-[#2e2e38] rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-pink-100 mb-6">
          Login to be part of your dream Recital!
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}