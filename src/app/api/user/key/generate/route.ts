import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';
import { generateKey, hashKey, obfuscateKey, prefixKey } from '@/app/_utils/key';

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
    const newSecret = generateKey();
    const prefixedSecret = prefixKey(newSecret);
    const obfuscatedSecret = obfuscateKey(prefixedSecret);

    const hashedSecret = await hashKey(newSecret);

    // prefixed with userId to avoid naming collisions in the Supabase vault.secrets table
    const keyName = `${userId}::${name}`;

    // create a new API key and store it in the Vault
    const { data, error } = await supabase.rpc('store_api_key', {
      _api_key: hashedSecret,
      _api_key_name: keyName,
      _obfuscated_key: obfuscatedSecret,
      _user_id: userId,
    });

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not generate API key' }), {
        status: 500,
      });
    }

    return new NextResponse(
      JSON.stringify({ id: data, key: prefixedSecret, name: keyName, isNew: true }),
      { status: 200 }
    );
  }
}
