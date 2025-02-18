'use client';

import { useEffect, useState } from 'react';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/client';
import { signInWithGithub, signOut } from '@/app/_services/github/auth';

export default function Login() {
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user !== null && data.user.aud === 'authenticated') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, [isLoggedIn]);

  const onClick = () => {
    if (isLoggedIn) {
      signOut(() => {
        window.location.href = '/';
      });
    } else {
      signInWithGithub((next?: string) => {
        sessionStorage.setItem('interweb_wtf_redirect_url', next ?? '');
      });
    }
  };

  return (
    <Button
      leftSection={!isLoggedIn ? <IconBrandGithubFilled /> : <></>}
      onClick={onClick}
      bg="violet"
    >
      {isLoggedIn ? 'Sign out' : 'Sign in'}
    </Button>
  );
}
