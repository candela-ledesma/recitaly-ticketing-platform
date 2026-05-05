'use server';
import { signIn } from '@/app/auth/auth';
import { AuthError } from 'next-auth';

export async function authenticate(_: unknown, fd: FormData) {
    try {
        await signIn('credentials', {
        email: fd.get('email'),
        password: fd.get('password'),
        redirectTo: '/admin',
        });
    } catch (e) {
        if (e instanceof AuthError) return 'Invalid email or password';
        throw e;
    }
}
