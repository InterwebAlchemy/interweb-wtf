import { IconBrandGithub } from '@tabler/icons-react';
import { Anchor, Center, Group, Stack, Text } from '@mantine/core';
import InterstitialCheckbox from '@/app/_components/InterstitialCheckbox';

export default function Footer() {
  return (
    <Center w="100%" mb="auto" pt="xl" pb="sm" pos="relative" bottom={0}>
      <Stack justify="center" w="100%">
        <InterstitialCheckbox />
        <Group align="center" justify="center">
          <Anchor href="/privacy.txt" c="gray" size="sm">
            Privacy
          </Anchor>
          <Text c="gray" size="sm">
            &copy;2025{' '}
            <Anchor href="https://interwebalchemy.com" c="gray">
              Interweb Alchemy
            </Anchor>
          </Text>
        </Group>
        <Group w="100%" justify="end">
          <Anchor
            href="https://github.com/InterwebAlchemy/interweb.wtf"
            c="gray"
            title="View the source code on GitHub"
          >
            <IconBrandGithub size={18} />
          </Anchor>
        </Group>
      </Stack>
    </Center>
  );
}
