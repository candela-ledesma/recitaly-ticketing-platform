// app/auth/auth.config.ts
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/app/lib/prisma';
import { baseAuthConfig } from './auth.base';

export const authConfig = {
  ...baseAuthConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (
          !creds ||
          typeof creds.email !== 'string' ||
          typeof creds.password !== 'string'
        ) return null;

        const bcrypt = await import('bcrypt');          
        const user   = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(creds.password, user.password);
        return ok ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
      },
    }),
  ],
};
