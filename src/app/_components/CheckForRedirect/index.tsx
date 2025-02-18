'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsClient } from 'usehooks-ts';
import { createClient } from '@/app/_adapters/supabase/client';

interface CheckForRedirectProps {
  ignoreRedirect?: boolean;
}

// see if we need to redirect the user to a different page (usually post-login)
export default function CheckForRedirect({ ignoreRedirect = false }: CheckForRedirectProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const supabase = createClient();

  useEffect(() => {
    if (isClient) {
      supabase.auth.getUser().then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else if (data.user) {
          const redirectUrl = sessionStorage.getItem('interweb_wtf_redirect_url');

          if (ignoreRedirect) {
            sessionStorage.removeItem('interweb_wtf_redirect_url');
          } else if (redirectUrl) {
            sessionStorage.removeItem('interweb_wtf_redirect_url');
            router.push(redirectUrl);
          }
        }
      });
    }
  }, [isClient, ignoreRedirect]);

  return <></>;
}
