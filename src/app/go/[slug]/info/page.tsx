import { notFound } from 'next/navigation';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LinkInfo({ params }: Params) {
  const slug = (await params).slug;

  const supabase = await createClient();

  const { data, error } = await supabase.from('short_urls').select('*').eq('slug', slug).limit(1);

  if (error) {
    console.error(error);
  }

  if (!slug || !data || data.length === 0) {
    return notFound();
  }

  const wtfLink = data[0];

  return (
    <Screen title={`WTFLink: ${wtfLink.slug}`}>
      <p>URL: {wtfLink.url}</p>
    </Screen>
  );
}
