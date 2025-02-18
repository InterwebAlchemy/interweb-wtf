import Link from 'next/link';
import { Anchor, Container, Stack, Text, Title } from '@mantine/core';

export default function GeneralSettingsTab() {
  return (
    <Container p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>Settings</Title>
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
    </Container>
  );
}
