import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  slug: string;
  id: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { slug, id } = requestObj;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not find user' }), {
        status: 401,
      });
    }

    const { data } = await supabase
      .from('short_urls')
      .update({ slug })
      .eq('id', id)
      .eq('created_by', user?.id)
      .select();

    const updatedUrl = data?.[0];

    return new NextResponse(JSON.stringify({ ...updatedUrl }), { status: 200 });
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify({ message: 'Could not connect to database' }), {
      status: 500,
    });
  }
}
