import { NextRequest, NextResponse } from 'next/server';
import { removeTrackingParams } from '@/app/_utils/url';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const json = searchParams.get('json') ?? false;

  if (!url) {
    return new NextResponse(JSON.stringify({ message: 'No URL provided' }), {
      status: 400,
    });
  }

  const cleanedUrl = removeTrackingParams(new URL(url));

  return new NextResponse(
    json ? JSON.stringify({ url: cleanedUrl.toString() }) : cleanedUrl.toString(),
    {
      status: 200,
      headers: {
        'content-type': json ? 'application/json' : 'text/plain',
      },
    }
  );
}
