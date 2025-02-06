import { Center, Stack } from '@mantine/core';
import Screen from '@/app/_components/Screen';
import { Welcome } from '@/app/_components/Welcome/Welcome';
import Intro from './_components/Intro';

export default function HomePage() {
  return (
    <Screen>
      <Center h="100%">
        <Stack align="center">
          <Welcome />
          <Intro />
        </Stack>
      </Center>
    </Screen>
  );
}
