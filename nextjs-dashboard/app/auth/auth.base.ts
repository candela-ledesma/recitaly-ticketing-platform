// app/auth/auth.base.ts
import type { NextAuthConfig } from 'next-auth';

export const baseAuthConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages:   { signIn: '/login' },

  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const adminRoute = nextUrl.pathname.startsWith('/admin');
      const isAdmin    = auth?.user?.role === 'ADMIN';
      return adminRoute ? isAdmin : true;
    },
    async jwt({ token, user }) {
      if (user) {
      token.role = (user as any).role;
      token.id = (user as any).id; 
    }
      return token;
    },
    async session({ session, token }) {
       if (token.role) session.user.role = token.role as any;
       // @ts-ignore-next-line (ignores the type error for this line) 
       if (token.id) session.user.id = token.id; 
      return session;
    },
  },
};
