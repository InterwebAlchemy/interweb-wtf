import Link from 'next/link';
import { IconBrandGithub } from '@tabler/icons-react';
import { Anchor, Center, Group, Stack, Text } from '@mantine/core';
import InterstitialCheckbox from '@/app/_components/InterstitialCheckbox';

export default function Footer() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/docs', label: 'Docs' },
    { href: '/docs/cli', label: 'API' },
    { href: '/privacy', label: 'Privacy' },
  ];

  const renderLinks = () => {
    return links.map((link) => (
      <Anchor href={link.href} component={Link} c="gray" size="sm">
        {link.label}
      </Anchor>
    ));
  };

  return (
    <Center w="100%" pt="xl" pb="sm" mt="auto">
      <Stack justify="center" align="center" w="100%">
        <InterstitialCheckbox />
        <Group align="center" w="100%" justify="flex-start">
          {renderLinks()}
          <Text c="gray" size="sm">
            &copy;2025{' '}
            <Anchor href="https://interwebalchemy.com" c="gray">
              Interweb Alchemy
            </Anchor>
          </Text>
          <Anchor
            href="https://github.com/InterwebAlchemy/interweb.wtf"
            c="gray"
            title="View the source code on GitHub"
            ml="auto"
          >
            <IconBrandGithub size={18} />
          </Anchor>
        </Group>
      </Stack>
    </Center>
  );
}
