// app/auth/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
 
    interface Session {
    user: {
        id: number;
        name: string;
        email: string;
        role: 'ADMIN' | 'USER';
    } & DefaultSession['user'];         
}

 
interface User extends DefaultUser {
    id: number;
    role: 'ADMIN' | 'USER';
}
}

declare module 'next-auth/jwt' {
    interface JWT {
    id: number;
    role?: 'ADMIN' | 'USER';
    }
}
