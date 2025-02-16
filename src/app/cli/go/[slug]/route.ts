import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  slug: string;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  const slug = (await params).slug;

  const supabase = await createClient();

  const { data } = await supabase.from('short_urls').select('url').eq('slug', slug).single();

  if (!data) {
    return new NextResponse(JSON.stringify({ message: 'Could not find URL' }), {
      status: 404,
    });
  }

  const { url } = data;

  return new NextResponse(url, {
    status: 200,
  });
}
