import Link from 'next/link';
import { Anchor, Box, Stack, Text } from '@mantine/core';

export default function GeneralSettingsTab() {
  return (
    <Box px="md" w={{ base: '100%', md: '80%' }}>
      <Stack h="100%" w="100%">
        <Text>
          More settings are coming soon, but for now you can use the{' '}
          <Anchor component={Link} href="/settings/developer">
            Developer
          </Anchor>{' '}
          section to generate{' '}
          <Anchor href="/docs" component={Link}>
            API
          </Anchor>{' '}
          Keys for use with{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          API.
        </Text>
        <Text>
          If you'd like to delete your account, that's in the{' '}
          <Anchor component={Link} href="/settings/danger">
            Danger Zone
          </Anchor>
          .
        </Text>
      </Stack>
    </Box>
  );
}
