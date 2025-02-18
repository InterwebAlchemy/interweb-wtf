import { NextRequest, NextResponse } from 'next/server';
import { removeTrackingParams } from '@/app/_utils/url';
import { KNOWN_SHORTENERS } from '@/constants';

export interface RequestProps {
  url: string[];
}

export async function GET(request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  let expectsJson = false;

  const searchParams = request.nextUrl.searchParams;

  const url = new URL(
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

  expectsJson = searchParams.get('json') === 'true' || url.pathname.endsWith('/json');

  searchParams.forEach((value, key) => {
    if (typeof value !== 'undefined') {
      url.searchParams.set(key, value as string);
    }
  });

  if (KNOWN_SHORTENERS.includes(url.hostname)) {
    return new NextResponse(
      JSON.stringify({
        message: 'Shortlink provided. Please expand it using `/is/[url]` instead.',
      }),
      {
        status: 400,
      }
    );
  }

  const cleanedUrl = removeTrackingParams(url);

  return new NextResponse(
    expectsJson ? JSON.stringify({ url: cleanedUrl.toString() }) : cleanedUrl.toString(),
    {
      status: 200,
      headers: {
        'content-type': expectsJson ? 'application/json' : 'text/plain',
      },
    }
  );
}
