import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { keyId } = await request.json();

  const supabase = await createClient();

  // change the deleted column to true
  const { error } = await supabase.from('api_keys').update({ deleted: true }).eq('id', keyId);

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new NextResponse(null, {
    status: 204,
  });
}
