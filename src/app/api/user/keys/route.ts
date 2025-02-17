import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  userId: string;
}

export async function POST(request: NextRequest) {
  // get user ID from request
  const requestObj: RequestProps = await request.json();

  const { userId } = requestObj;

  // get current user session from supabase
  const supabase = await createClient();

  // check if user ID matches current user
  if (typeof userId !== 'undefined') {
    // create a new API key and store it in the Vault
    const { data, error } = await supabase.rpc('get_user_api_keys', {
      _user_id: userId,
    });

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not generate API key' }), {
        status: 500,
      });
    }

    const keys = data.map((key: { name: string; key: string }) => {
      return {
        name: key.name.replace(`${userId}::`, ''),
        // obfuscate the key and only show the first and last 4 characters
        key: `${key.key.slice(0, 4)}${'*'.repeat(key.key.length - 8)}${key.key.slice(-4)}`,
      };
    });

    return new NextResponse(JSON.stringify({ keys }), { status: 200 });
  }
}
