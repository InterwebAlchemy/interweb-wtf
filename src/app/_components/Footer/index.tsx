import Link from 'next/link';
import { IconBrandGithub } from '@tabler/icons-react';
import { Anchor, Center, Group, Stack, Text } from '@mantine/core';
import InterstitialCheckbox from '@/app/_components/InterstitialCheckbox';

export default function Footer() {
  return (
    <Center w="100%" pt="xl" pb="sm" mt="auto">
      <Stack justify="center" align="center" w="100%">
        <InterstitialCheckbox />
        <Group align="center" w="100%" justify="flex-start">
          <Anchor href="/" component={Link} c="gray" size="sm">
            Home
          </Anchor>
          <Anchor href="/docs" component={Link} c="gray" size="sm">
            Docs
          </Anchor>
          <Anchor href="/docs/cli" component={Link} c="gray" size="sm">
            API
          </Anchor>
          <Anchor href="/about" component={Link} c="gray" size="sm">
            About
          </Anchor>
          <Anchor href="/privacy" component={Link} c="gray" size="sm">
            Privacy
          </Anchor>
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
