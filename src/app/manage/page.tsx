import { redirect } from 'next/navigation';
import { createClient } from '@/app/_adapters/supabase/server';

export default async function ManagePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  } else {
    redirect('/dashboard');
  }
}
