import { createClient } from '@/app/_adapters/supabase/client';

const supabase = createClient();

export async function getUser(): Promise<unknown> {
  const { data, error } = await supabase.auth.getUser();

  console.log('data:', data);

  // supabase.db.from('users').select().eq('id', data?.id);

  if (error) {
    console.error('Error:', error);
  }

  return data;
}
