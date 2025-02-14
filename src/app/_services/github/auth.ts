import { createClient } from '@/app/_adapters/supabase/client';

const supabase = createClient();

export function signInWithGithub(afterSignin?: () => void): void {
  const redirectTo = ['production', 'local'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV ?? '')
    ? `${process.env.NEXT_PUBLIC_APPLICATION_URL}/auth/callback`
    : `https://${process?.env?.NEXT_PUBLIC_VERCEL_URL ?? ''}/auth/callback`;

  supabase.auth
    .signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
      },
    })
    .then(() => {
      afterSignin?.();
    })
    .catch((error) => {
      console.error('Login Error:', error);
    });
}

export function signOut(afterSignout?: () => void): void {
  supabase.auth
    .signOut()
    .then(() => {
      afterSignout?.();
    })
    .catch((error) => {
      console.error('Logout Error:', error);
    });
}
