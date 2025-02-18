import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  userId: string;
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<RequestProps> }) {
  const userId = (await params).userId;

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

  if (typeof userId !== 'undefined' && userId === user?.id) {
    const supabaseAdmin = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error;

      return new NextResponse(JSON.stringify({ message: 'Could not delete user' }), {
        status: 500,
      });
    }

    return new NextResponse(null, {
      status: 204,
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Could not find user' }), {
    status: 400,
  });
}
