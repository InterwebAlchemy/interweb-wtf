'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/client';
import { signInWithGithub, signOut } from '@/app/_services/github/auth';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error(error);
        }

        if (data.user !== null && data.user.aud === 'authenticated') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === '/') {
        window.location.href = '/';
      } else {
        router.push(redirectTo);
      }
    }
  }, [redirectTo]);

  const onClick = () => {
    if (isLoggedIn) {
      signOut()
        .then(() => {
          setIsLoggedIn(false);
        })
        .finally(() => {
          setRedirectTo('/');
        });
    } else {
      signInWithGithub()
        .then(() => {
          console.log('LOGGED IN');
          setIsLoggedIn(true);
        })
        .catch(() => {
          setRedirectTo('/request-invite');
        })
        .finally(() => {
          setRedirectTo('/dashboard');
        });
    }
  };

  return (
    <>
      <Button
        leftSection={!isLoggedIn ? <IconBrandGithubFilled /> : <></>}
        onClick={onClick}
        bg="violet"
      >
        {isLoggedIn ? 'Sign out' : 'Sign in'}
      </Button>
    </>
  );
}
