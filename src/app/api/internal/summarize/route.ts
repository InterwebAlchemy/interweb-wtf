import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';
import { summarize } from '@/app/_services/kagi/summarize';

export interface RequestProps {
  url: string;
  url_id: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url, url_id } = requestObj;

  const supabase = await createClient();

  try {
    const { data } = await supabase.from('url_summaries').select('*').eq('id', url_id).single();

    if (data !== null) {
      return new NextResponse(JSON.stringify(data), {
        status: 200,
      });
    }
  } catch (error) {
    console.error('GET URL SUMMARY ERROR:', error);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return new NextResponse(JSON.stringify({ error: userError?.message }), {
      status: 401,
    });
  }

  try {
    const { summary, error } = await summarize(url);

    if (!error) {
      const { data, error } = await supabase
        .from('url_summaries')
        .insert([
          {
            url_id,
            summary,
          },
        ])
        .select();

      if (error) {
        console.error('SUMMARIZE ERROR:', error);
      }

      if (data === null) {
        return new NextResponse(
          JSON.stringify({
            message: 'Could not store summary',
          }),
          {
            status: 500,
          }
        );
      }

      return new NextResponse(JSON.stringify(data[0]), {
        status: 201,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Could not summarize the URL',
      }),
      {
        status: 500,
      }
    );
  } catch (error) {
    console.error('SUMMARIZE ERROR:', error);

    return new NextResponse(
      JSON.stringify({
        message: 'Could not summarize the URL',
      }),
      {
        status: 500,
      }
    );
  }
}
