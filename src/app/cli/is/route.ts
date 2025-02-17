import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shortUrl = searchParams.get('url');
  const json = searchParams.get('json') ?? false;

  const supabase = await createClient();

  const { data } = await supabase
    .from('expanded_urls')
    .select('expanded_url')
    .eq('short_url', shortUrl)
    .single();

  // TODO: expand the shortURL

  if (!data) {
    return new NextResponse(JSON.stringify({ message: 'Could not find short URL' }), {
      status: 404,
    });
  }

  const { expanded_url: url } = data;

  return new NextResponse(json ? JSON.stringify({ url }) : url, {
    status: 200,
    headers: {
      'content-type': json ? 'application/json' : 'text/plain',
    },
  });
}
