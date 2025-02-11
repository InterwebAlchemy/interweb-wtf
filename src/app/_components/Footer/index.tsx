import { Anchor, Center, Group, Stack, Text } from '@mantine/core';
import InterstitialCheckbox from '@/app/_components/InterstitialCheckbox';

export default function Footer() {
  return (
    <Center w="100%" mb="auto" pt="xl" pb="sm">
      <Stack>
        <InterstitialCheckbox />
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
      </Stack>
    </Center>
  );
}
