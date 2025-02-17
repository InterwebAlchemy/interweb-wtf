import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  userId: string;
  name: string;
}

export async function POST(request: NextRequest) {
  // get user ID from request
  const requestObj: RequestProps = await request.json();

  const { userId, name } = requestObj;

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
    // generate random string of 32 characters for API key and prefix it
    const newSecret = `${process.env.API_SECRET_PREFIX}${[...Array(32)].map(() => (~~(Math.random() * 36)).toString(36)).join('')}`;

    // create a new API key and store it in the Vault
    const { data, error } = await supabase.rpc('generate_api_key', {
      _api_key: newSecret,
      _api_key_name: `${userId}::${name}`,
      _user_id: userId,
    });

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not generate API key' }), {
        status: 500,
      });
    }

    return new NextResponse(JSON.stringify({ keyId: data }), { status: 200 });
  }
}
