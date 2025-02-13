import { permanentRedirect, redirect, RedirectType } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<RequestProps> }) {
  const supabase = await createClient();

  const slug = (await params).slug;

  const {
    data: { id, url },
  } = await supabase.from('short_urls').select('*').eq('slug', slug).single();

  const {
    data: { title, description, metadata, screenshot, favicon },
  } = await supabase.from('url_info').select('*').eq('url_id', id).single();

  let imageSrc: string = '';

  try {
    const { data } = await supabase.storage.from('inspector-screenshots').getPublicUrl(screenshot);
    imageSrc = data?.publicUrl;
  } catch (error) {
    console.error(error);
  }

  return {
    metadataBase: url,
    generator: 'Interweb.WTF',
    applicationName: 'Interweb.WTF',
    title,
    description,
    referrer: '',
    icons: {
      icon: favicon,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: imageSrc,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [imageSrc],
    },
    ...metadata,
  };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  const slug = (await params)?.slug;

  if (typeof slug !== 'undefined') {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('short_urls')
      .select('url')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(error);
    }

    if (!data) {
      redirect('/404');
    }

    const redirectUrl = data.url;

    if (redirectUrl) {
      permanentRedirect(redirectUrl, RedirectType.replace);
    }
  }

  return new NextResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
}
