import { cookies } from 'next/headers';
import { permanentRedirect, redirect, RedirectType } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  slug: string;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  const cookieStore = await cookies();
  const slug = (await params)?.slug;
  const skipInfoInterstitial = cookieStore.get('skip_info_interstitial');

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
      if (typeof skipInfoInterstitial !== 'undefined' && skipInfoInterstitial.value === 'true') {
        permanentRedirect(redirectUrl, RedirectType.replace);
      } else {
        redirect(`/go/${slug}/info`);
      }
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
  }
}
