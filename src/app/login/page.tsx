import { Center, Stack } from '@mantine/core';
import Login from '@/app/_components/Login';
import Screen from '@/app/_components/Screen';
import PrivateBeta from '../_components/PrivateBeta';

export default function LoginPage() {
  return (
    <Screen title="Sign In">
      <Center h="100%">
        <Stack>
          <PrivateBeta />
          <Login />
        </Stack>
      </Center>
    </Screen>
  );
}
