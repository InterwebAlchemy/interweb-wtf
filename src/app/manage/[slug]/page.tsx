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

  const { data, error } = await supabase
    .from('short_urls')
    .select('*')
    .eq('created_by', user?.id)
    .eq('slug', slug)
    .limit(1);

  if (error) {
    console.error(error);
  }

  const info = data?.[0];

  return (
    <Screen title="Edit WTFLink">
      <Stack>
        <UrlInput defaultValue={info.url} readOnly />
        <ShortLinkInput slug={slug} linkId={info.id} />
      </Stack>
    </Screen>
  );
}
