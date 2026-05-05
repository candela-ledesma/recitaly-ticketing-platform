import { auth } from '@/app/auth/auth';              
import { redirect } from 'next/navigation';
import AdminClient from '../ui/admin/AdminClient';   

export default async function AdminPage() {
  
  const session = await auth();

  
  if (!session || session.user.role !== 'ADMIN') {
    return redirect('/admin-login');              
  }

  
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <AdminClient />
    </div>
  );
}
