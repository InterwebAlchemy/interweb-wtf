import { redirect } from 'next/navigation';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';
import UrlDashboard from '@/app/_components/UrlDashboard';
import { Tables } from '@/types/supabase';

export default async function DashboardPage() {
  const supabase = await createClient();
  const urls: Array<Tables<'short_urls'>> = [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (typeof user === 'undefined' || user === null) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('short_urls')
    .select('*')
    .eq('created_by', user?.id)
    .eq('deleted', false)
    .order('created_at', { ascending: false });

  if (typeof data !== 'undefined' && data !== null) {
    urls.push(...data);
  }

  return (
    <Screen title="Dashboard" authenticated>
      <UrlDashboard urls={urls} />
    </Screen>
  );
}
