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
    (async function () {
      try {
        const user = await supabase.auth.getUser();

        console.log('User:', user);

        if (user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const onClick = () => {
    if (isLoggedIn) {
      signOut().then(() => {
        setIsLoggedIn(false);
      });
    } else {
      signInWithGithub().then(() => {
        setIsLoggedIn(true);
      });
    }
  };

  const onClickSignOut = () => {
    signOut().then(() => {
      setIsLoggedIn(false);
    });
  };

  return (
    <>
      <Button leftSection={<IconBrandGithubFilled />} onClick={onClick}>
        Sign in
      </Button>
      <br />
      <br />
      <br />
      <Button onClick={onClickSignOut}>Logout</Button>
    </>
  );
}
