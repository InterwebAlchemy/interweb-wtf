import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';
import { KNOWN_SHORTENERS } from '@/constants';

export interface RequestProps {
  url: string[];
}

export async function GET(request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  let expectsJson = false;
  let mightExpectJson = false;

  const searchParams = request.nextUrl.searchParams;

  const supabase = await createClient();

  const shortUrl = new URL(
    (await params).url
      .map((part, i) => {
        let formattedPart = decodeURIComponent(part);

        if (i === 0) {
          if (formattedPart.startsWith('http:') || formattedPart.startsWith('https:')) {
            formattedPart = formattedPart.replace(/[^http:|https:]/g, '');

            formattedPart = `${formattedPart}/`;
          } else {
            formattedPart = `https://${formattedPart}`;
          }
        }

        return formattedPart;
      })
      .join('/')
  );

  searchParams.forEach((value, key) => {
    if (typeof value !== 'undefined') {
      shortUrl.searchParams.set(key, value as string);
    }
  });

  let fullUrl;

  // check to see if this is a interweb.wtf/cli/is/[url]/json request
  if (shortUrl.pathname.endsWith('/json')) {
    mightExpectJson = true;

    shortUrl.pathname = shortUrl.pathname.replace('/json', '');

    const { data, error } = await supabase
      .from('expanded_urls')
      .select('expanded_url')
      .eq('short_url', shortUrl)
      .single();

    // if we didn't find a short url without the /json
    // let's double-check the short url with the /json
    if (!data || error) {
      shortUrl.pathname = `${shortUrl.pathname}/json`;
    } else {
      fullUrl = data?.expanded_url;
      expectsJson = mightExpectJson;
    }
  }

  const { data, error } = await supabase
    .from('expanded_urls')
    .select('expanded_url')
    .eq('short_url', shortUrl)
    .single();

  if (!data || error) {
    if (!KNOWN_SHORTENERS.includes(shortUrl.hostname)) {
      return new NextResponse(
        JSON.stringify({
          message: `Unknown shortener service. Request support for ${shortUrl.hostname}: ${process.env.NEXT_PUBLIC_SHORTENER_REQUEST_URL} `,
        }),
        {
          status: 400,
        }
      );
    }

    // let's expand the URL
    const apiUrl = new URL('/api/fetch', process.env.NEXT_PUBLIC_APPLICATION_URL);

    // since we haven't shortened this one yet, the user might be
    // expecting a JSON response by appending /json to the URL
    if (mightExpectJson) {
      shortUrl.pathname = shortUrl.pathname.replace('/json', '');
    }

    const fetchedResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: shortUrl.toString() }),
    }).then(async (res) => {
      return await res.json();
    });

    // if there was an error, maybe the /json was actually part of it
    if (fetchedResponse.error && mightExpectJson) {
      shortUrl.pathname = `${shortUrl.pathname}/json`;
    }

    expectsJson = mightExpectJson;

    fullUrl = new URL(fetchedResponse.url);

    const expandApiUrl = new URL('/api/expand', process.env.NEXT_PUBLIC_APPLICATION_URL);

    try {
      // let's go ahead and expand this URL and cache it
      await fetch(expandApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortUrl: shortUrl.toString(), url: fullUrl }),
      }).then(async (res) => {
        if (res.ok) {
          return await res.json();
        }

        console.log('Failed to cache expanded URL');
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    fullUrl = data.expanded_url;
  }

  if (!fullUrl) {
    return new NextResponse(JSON.stringify({ message: 'Could not expand short URL' }), {
      status: 404,
    });
  }

  return new NextResponse(expectsJson ? JSON.stringify({ url: fullUrl }) : fullUrl, {
    status: 200,
    headers: {
      'content-type': expectsJson ? 'application/json' : 'text/plain',
    },
  });
}
