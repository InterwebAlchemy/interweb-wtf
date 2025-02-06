import { Stack, Text, Title } from '@mantine/core';

export default function PrivateBeta() {
  return (
    <Stack align="center">
      <Title order={2}>interweb.wtf is in Private Beta</Title>
      <Text>
        Sorry, but we're currently <strong>invite-only</strong>.
      </Text>
    </Stack>
  );
}
