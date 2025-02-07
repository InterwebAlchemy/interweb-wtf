import { NextRequest, NextResponse } from 'next/server';
import Haikunator from 'haikunator';
import { createClient } from '@/app/_adapters/supabase/server';

// TODO: url scanning
// import cloudflare from '@/app/_services/cloudflare';
// import { KNOWN_DOMAINS } from '@/app/constants';

export interface RequestProps {
  url: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url } = requestObj;

  const urlObj = new URL(url);

  const haikunator = new Haikunator();

  const supabase = await createClient();

  let slug = haikunator.haikunate({ tokenLength: 0 });

  try {
    // generate a unique slug
    while (await supabase.from('short_urls').select('slug').eq('slug', slug).single()) {
      slug = haikunator.haikunate({ tokenLength: 0 });
    }

    try {
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
        .insert({
          url: urlObj.toString(),
          slug,
          created_by: user?.id,
          pending: true,
        })
        .select();

      const storedUrl = data?.[0];

      // TODO: generate QR code for short URL

      // TODO: Add scanning for malicious domains
      // if (!KNOWN_DOMAINS.includes(urlObj.hostname.split('.').slice(-2).join('.'))) {
      //   try {
      //     // scan the URL
      //     const scan = await cloudflare.urlScanner.scans.create({
      //       account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
      //       url: urlObj.toString(),
      //     });

      //     console.log('SCAN:', scan);

      //     // store the scan results in the database
      //     await supabase.from('url_reports').insert({
      //       url_id: storedUrl?.data?.[0]?.id,
      //       cloudflare_scan_results: scan,
      //     });
      //   } catch (error) {
      //     console.error(error);

      //     return new NextResponse(JSON.stringify({ message: 'Failed to scan URL' }), { status: 500 });
      //   }
      // } else {
      //   // TODO: trigger scrape/preview snapshot retrieval
      // }

      return new NextResponse(JSON.stringify({ ...storedUrl }), { status: 201 });
    } catch (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not connect to database' }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify({ message: 'Could not create unique short url slug' }), {
      status: 500,
    });
  }
}
