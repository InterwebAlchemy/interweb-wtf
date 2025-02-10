import { Center, Stack } from '@mantine/core';
import Login from '@/app/_components/Login';
import PrivateBeta from '@/app/_components/PrivateBeta';
import Screen from '@/app/_components/Screen';

export default function LoginPage() {
  return (
    <Screen title="Sign In">
      <Center h="80%">
        <Stack>
          <PrivateBeta />
          <Login />
        </Stack>
      </Center>
    </Screen>
  );
}
