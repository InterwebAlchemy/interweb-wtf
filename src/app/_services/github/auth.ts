import { createClient } from '@/app/_adapters/supabase/client';

const supabase = createClient();

export function signInWithGithub(): void {
  const redirectTo = ['production', 'local'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV ?? '')
    ? `${process.env.NEXT_PUBLIC_APPLICATION_URL}/auth/callback?next=/dashboard`
    : `https://${process?.env?.NEXT_PUBLIC_VERCEL_URL ?? ''}/auth/callback?next="/dashboard`;

  console.log('redirectTo:', redirectTo);

  supabase.auth
    .signInWithOAuth({
      provider: 'github',
      options: {
        // redirectTo,
      },
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('Login Error:', error);
        return;
      }

      console.log('DATA:', data);
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
