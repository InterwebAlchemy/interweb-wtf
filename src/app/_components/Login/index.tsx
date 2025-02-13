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
        const { data } = await supabase.auth.getUser();

        if (data.user !== null && data.user.aud === 'authenticated') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const onClick = () => {
    if (isLoggedIn) {
      signOut()
        .then(() => {
          setIsLoggedIn(false);
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
        .catch(() => {
          router.push('/request-invite/');
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
