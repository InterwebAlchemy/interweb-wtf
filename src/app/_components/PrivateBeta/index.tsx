import { Button, Center, Flex, Text, Title } from '@mantine/core';

export default function PrivateBeta() {
  return (
    <Center style={{ height: '100vh' }}>
      <Flex direction="column" align="center">
        <Title order={2}>interweb.wtf is in Private Beta</Title>
        <Text>
          Sorry, but we're currently <strong>invite-only</strong>.
        </Text>
        <Button>Request an Invite</Button>
      </Flex>
    </Center>
  );
}
