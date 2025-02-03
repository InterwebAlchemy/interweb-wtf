'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconWorldQuestion } from '@tabler/icons-react';
import { Avatar, Drawer, Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useUserProfile from '@/app/_hooks/useUserProfile';
import { signOut } from '@/app/_services/github/auth';

const links = [
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/research', label: 'Research' },
  { link: '/notes', label: 'Notes' },
  { link: '/about', label: 'About' },
];

export default function Nav() {
  const router = useRouter();
  const { loading, profile } = useUserProfile();

  const [opened, { open, close }] = useDisclosure(false);

  const [avatar, setAvatar] = useState<string>();

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
        <Stack>{items}</Stack>
      </Drawer>
      <header>
        <Group justify="center" align="center">
          <Link href="/" style={{ marginRight: 'auto', textDecoration: 'none', color: 'inherit' }}>
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
