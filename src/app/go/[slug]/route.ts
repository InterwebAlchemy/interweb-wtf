import { permanentRedirect, RedirectType } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  slug: string;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  const slug = (await params)?.slug;

  if (typeof slug !== 'undefined') {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('short_urls')
      .select('url')
      .eq('slug', slug)
      .limit(1);

    if (error) {
      console.error(error);
    }

    if (!data) {
      return new NextResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }

    const redirectUrl = data[0].url;

    if (redirectUrl) {
      permanentRedirect(redirectUrl, RedirectType.replace);
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
  }
}

export async function getStaticPaths() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('short_urls').select('slug');

  if (error) {
    console.error(error);
  }

  if (typeof data !== 'undefined' && data !== null) {
    return {
      paths: data.map(({ slug }) => ({ params: { slug } })),
      fallback: true,
    };
  }

  return {
    paths: [],
    fallback: true,
  };
}
