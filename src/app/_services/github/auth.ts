import { createClient } from '@/app/_adapters/supabase/client';

const supabase = createClient();

export function signInWithGithub(afterSignin?: (next?: string) => void): void {
  const redirectTo = ['production', 'local'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV ?? '')
    ? `${process.env.NEXT_PUBLIC_APPLICATION_URL}/auth/callback?next=/dashboard`
    : `https://${process?.env?.NEXT_PUBLIC_VERCEL_URL ?? ''}/auth/callback?next=/dashboard`;

  supabase.auth
    .signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
      },
    })
    .then(({ data, error }) => {
      if (!data || error) {
        console.error('Login Error:', error);
      } else if (data.provider === 'github') {
        try {
          const url = new URL(data.url);
          const redirectToUrl = new URL(url.searchParams.get('redirect_to') ?? '');
          const next = redirectToUrl.searchParams.get('next') ?? '';

          if (next) {
            afterSignin?.(next);
          }
        } catch (error) {
          console.error('Login Error:', error);
        }
      }
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
