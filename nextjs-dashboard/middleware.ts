// middleware.ts (en la raíz)
import NextAuth from 'next-auth';
import { baseAuthConfig } from './app/auth/auth.base';

export default NextAuth(baseAuthConfig).auth;

export const config = {
  matcher: ['/admin', '/admin/:path*'],       
};
// DEBUG — elimina en prod
