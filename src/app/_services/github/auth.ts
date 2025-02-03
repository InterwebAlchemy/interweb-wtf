import { createClient } from '@/app/_adapters/supabase/client';

const supabase = createClient();

export async function signInWithGithub(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: ['production', 'local'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV ?? '')
        ? `${process.env.NEXT_PUBLIC_APPLICATION_URL}/auth/callback`
        : `https://${process?.env?.NEXT_PUBLIC_VERCEL_URL ?? ''}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error:', error);
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error:', error);
  }
}
