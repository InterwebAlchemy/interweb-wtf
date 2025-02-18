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

      return new NextResponse(JSON.stringify({ message: 'Could not get API keys' }), {
        status: 500,
      });
    }

    // TODO: fix the type for the rcp response
    const keys = data.map((key: Record<string, any>) => {
      return {
        id: key.id,
        name: key.name?.replace(`${userId}::`, '') ?? 'API Key',
        key: key.key,
        createdAt: key.created_at,
        isNew: false,
      };
    });

    return new NextResponse(JSON.stringify({ keys }), { status: 200 });
  }
}
