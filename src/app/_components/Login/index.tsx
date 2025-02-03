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

  useEffect(() => {
    (async function () {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.log('GETUSER ERROR:', error);
        }

        if (data.user !== null && data.user.aud === 'authenticated') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('GETUSER EXCEPTION:', error);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard/');
    }
  }, [isLoggedIn]);

  const onClick = () => {
    if (isLoggedIn) {
      signOut()
        .then(() => {
          setIsLoggedIn(false);
        })
        .catch((error) => {
          console.error('SIGNOUT ERROR:', error);
        })
        .finally(() => {
          router.push('/');
        });
    } else {
      signInWithGithub()
        .then(() => {
          setIsLoggedIn(true);

          router.push('/dashboard/');
        })
        .catch((error) => {
          console.error('LOGIN ERROR:', error);

          router.push('/request-invite/');
        });
    }
  };

  return (
    <>
      <Button leftSection={<IconBrandGithubFilled />} onClick={onClick}>
        {isLoggedIn ? 'Sign out' : 'Sign in w/ Github'}
      </Button>
    </>
  );
}
