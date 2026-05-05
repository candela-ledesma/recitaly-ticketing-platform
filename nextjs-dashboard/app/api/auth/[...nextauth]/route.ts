// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/app/auth/auth.config';   


export const { GET, POST } = NextAuth(authConfig).handlers;
