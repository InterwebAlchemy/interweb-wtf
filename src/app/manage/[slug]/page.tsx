import { redirect } from 'next/navigation';
import { Stack } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';
import ShortLinkInput from '@/app/_components/ShortLinkInput';
import UrlInput from '@/app/_components/UrlInput';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ManageLinkPage({ params }: Params) {
  const slug = (await params).slug;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('short_urls')
    .select('*')
    .eq('created_by', user?.id)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(error);
  }

  return (
    <Screen title="Edit WTFLink">
      <Stack>
        <UrlInput defaultValue={data.url} readOnly />
        <ShortLinkInput slug={slug} linkId={data.id} />
      </Stack>
    </Screen>
  );
}
