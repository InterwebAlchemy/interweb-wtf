import { Anchor, Center, Group, Text } from '@mantine/core';

export default function Footer() {
  return (
    <Center w="100%" mb="auto" pt="xl" pb="sm">
      <Group>
        <Anchor href="/privacy.txt" c="gray" size="sm">
          Privacy Policy
        </Anchor>
        <Text c="gray" size="sm">
          &copy;2025{' '}
          <Anchor href="https://interwebalchemy.com" c="gray">
            Interweb Alchemy
          </Anchor>
        </Text>
      </Group>
    </Center>
  );
}
