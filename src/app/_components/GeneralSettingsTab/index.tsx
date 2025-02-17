import Link from 'next/link';
import { Anchor, Box, Code, Stack, Text, Title } from '@mantine/core';

export default function GeneralSettingsTab() {
  return (
    <Box p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>Settings</Title>
        <Text>
          More settings are coming soon, but for now you can use the <Code>Developer</Code> section
          to generate{' '}
          <Anchor href="/docs" component={Link}>
            API
          </Anchor>{' '}
          Keys for use with <Code>/cli</Code> endpoints that you can use programmatically.
        </Text>
        <Text>
          If you'd like to delete your account, that's in the <Code>Danger Zone</Code>.
        </Text>
      </Stack>
    </Box>
  );
}
