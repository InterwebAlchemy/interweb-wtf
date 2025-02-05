'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconWorldQuestion } from '@tabler/icons-react';
import { Avatar, Drawer, Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import UrlInput from '@/app/_components/UrlInput';
import useUserProfile from '@/app/_hooks/useUserProfile';
import { signOut } from '@/app/_services/github/auth';

const links = [{ link: '/dashboard', label: 'Dashboard' }];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, profile } = useUserProfile();

  const [opened, { open, close }] = useDisclosure(false);

  const [avatar, setAvatar] = useState<string>();

  const onUrlInputSubmit = async (url: string): Promise<void> => {
    console.log(`Shortening URL: ${url}`);

    await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  };

  useEffect(() => {
    if (profile && !loading) {
      if (typeof profile.avatar_url !== 'undefined' && profile.avatar_url !== null) {
        setAvatar(profile.avatar_url);
      }
    }
  }, [loading, profile]);

  const logout = () => {
    signOut().then(() => {
      router.push('/');
    });
  };

  const items = links.map((item) => {
    const { link, label } = item;

    return (
      <Link key={label} href={link}>
        {label}
      </Link>
    );
  });

  items.push(
    <UnstyledButton key="logout" onClick={logout}>
      Sign out
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
            href="/dashboard"
            style={{ marginRight: 'auto', textDecoration: 'none', color: 'inherit' }}
          >
            <Group align="center" gap="5px">
              <ThemeIcon size="lg" color="violet">
                <IconWorldQuestion />
              </ThemeIcon>
              <Text size="xl" fw="bold">
                interweb.wtf
              </Text>
            </Group>
          </Link>

          {!loading && avatar && (
            <UnstyledButton style={{ marginLeft: 'auto' }} onClick={open}>
              <Avatar src={avatar} alt="User avatar" />
            </UnstyledButton>
          )}
        </Group>
      </header>
    </>
  );
}
