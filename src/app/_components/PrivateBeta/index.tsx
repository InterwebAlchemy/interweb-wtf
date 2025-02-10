import { Anchor, Stack, Text, Title } from '@mantine/core';

export default function PrivateBeta() {
  return (
    <Stack align="center" h="100%" justify="center">
      <Title order={2}>interweb.wtf is in Private Beta</Title>
      <Text>
        Sorry, but we're currently{' '}
        <Anchor c="violet" underline="always" href={process.env.NEXT_PUBLIC_INVITE_URL} fw="bold">
          invite-only
        </Anchor>
        .
      </Text>
    </Stack>
  );
}
