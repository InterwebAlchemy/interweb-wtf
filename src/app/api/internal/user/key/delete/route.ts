import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { keyId, userId } = await request.json();

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return new NextResponse(JSON.stringify({ error: userError.message }), {
      status: 401,
    });
  }

  if (user?.id !== userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // change the deleted column to true
  const { error } = await supabase
    .from('api_keys')
    .update({ deleted: true })
    .eq('id', keyId)
    .eq('user_id', userId)
    .eq('deleted', false);

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new NextResponse(null, {
    status: 204,
  });
}
