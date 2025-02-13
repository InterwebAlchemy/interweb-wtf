import { NextRequest, NextResponse } from 'next/server';

export interface RequestProps {
  url: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url } = requestObj;

  const urlObj = new URL(url);

  if (!urlObj.hostname) {
    return new NextResponse(JSON.stringify({ message: 'Invalid URL' }), { status: 400 });
  }

  try {
    const response = await fetch(url);

    const { status, redirected, headers: requestHeaders, url: fullUrl } = response;

    const contentType = requestHeaders.get('content-type');

    return new NextResponse(
      JSON.stringify({ status, url: fullUrl, redirected, headers: requestHeaders, contentType }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ message: `Could not connect to ${urlObj.hostname}` }),
      {
        status: 500,
      }
    );
  }
}
