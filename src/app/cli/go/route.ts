import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const json = searchParams.get('json') ?? false;

  const supabase = await createClient();

  const { data } = await supabase.from('short_urls').select('url').eq('slug', slug).single();

  if (!data) {
    return new NextResponse(JSON.stringify({ message: 'Could not find URL' }), {
      status: 404,
    });
  }

  const { url } = data;

  return new NextResponse(json ? JSON.stringify({ url }) : url, {
    status: 200,
  });
}
