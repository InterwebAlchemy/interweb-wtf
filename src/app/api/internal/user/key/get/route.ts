import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  userId: string;
  keyId: string;
}

export async function POST(request: NextRequest) {
  // get user ID from request
  const requestObj: RequestProps = await request.json();

  const { userId, keyId } = requestObj;

  // get current user session from supabase
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

  // check if user ID matches current user
  if (typeof userId !== 'undefined' && userId === user?.id) {
    // create a new API key and store it in the Vault
    const { data, error } = await supabase.rpc('get_user_api_key', {
      _user_id: userId,
      _key_id: keyId,
    });

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not generate API key' }), {
        status: 500,
      });
    }

    const key = data[0];

    key.name = key.name.replace(`${userId}::`, '');

    return new NextResponse(JSON.stringify({ key }), { status: 200 });
  }

  return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
  });
}
