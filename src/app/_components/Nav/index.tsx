'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconWorldQuestion } from '@tabler/icons-react';
import {
  Anchor,
  Avatar,
  Drawer,
  Group,
  Indicator,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Login from '@/app/_components/Login';
import UrlInput from '@/app/_components/UrlInput';
import useUserProfile from '@/app/_hooks/useUserProfile';
import { signOut } from '@/app/_services/github/auth';

const links = [
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/is', label: 'Expander' },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, profile } = useUserProfile();

  const [opened, { open, close }] = useDisclosure(false);

  const [avatar, setAvatar] = useState<string>();

  const onUrlInputSubmit = async (url: string): Promise<void> => {
    await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, userAgent: navigator.userAgent }),
    })
      .then(async (res) => {
        if (res.ok) {
          return await res.json();
        }
      })
      .then(async (response) => {
        const { slug, id } = response;

        await fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, url_id: id }),
        })
          .then(async (res) => {
            if (res.ok) {
              return await res.json();
            }
          })
          .catch(void 0);

        router.push(`/go/${slug}/info`);
      })
      .catch(void 0);
  };

  useEffect(() => {
    if (profile && !loading) {
      if (typeof profile.avatar_url !== 'undefined' && profile.avatar_url !== null) {
        setAvatar(profile.avatar_url);
      }
    }
  }, [loading, profile]);

  const logout = () => {
    signOut()
      .catch(void 0)
      .finally(() => {
        window.location.href = '/';
      });
  };

  const items = links.map((item) => {
    const { link, label } = item;

    return (
      <Anchor key={label} href={link} component={Link}>
        {label}
      </Anchor>
    );
  });

  items.push(
    <UnstyledButton key="logout" id="signout-link" onClick={logout} c="blue">
      <Text c="blue">Sign out</Text>
    </UnstyledButton>
  );

  return (
    <>
      <Drawer opened={opened} onClose={close} padding="md" position="right">
        <Stack>
          {pathname !== '/dashboard' ? (
            <UrlInput onSubmit={onUrlInputSubmit} clearOnSubmit />
          ) : (
            <></>
          )}
          {items}
        </Stack>
      </Drawer>
      <header>
        <Group justify="center" align="center">
          <Link
            href={!user ? '/' : '/dashboard'}
            style={{ marginRight: 'auto', textDecoration: 'none', color: 'inherit' }}
          >
            <Indicator
              inline
              label="Beta"
              radius="sm"
              size="md"
              color="gray"
              position="middle-end"
              offset={-30}
            >
              <Group align="center" gap="5px">
                <ThemeIcon size="lg" color="violet">
                  <IconWorldQuestion />
                </ThemeIcon>
                <Text size="xl" fw="bold">
                  interweb.wtf
                </Text>
              </Group>
            </Indicator>
          </Link>

          {!loading && !user && pathname !== '/login' ? (
            <Login />
          ) : (
            avatar && (
              <UnstyledButton style={{ marginLeft: 'auto' }} onClick={open}>
                <Avatar src={avatar} alt="User avatar" />
              </UnstyledButton>
            )
          )}
        </Group>
      </header>
    </>
  );
}
