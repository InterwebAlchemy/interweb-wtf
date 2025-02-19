import { Center, Stack } from '@mantine/core';
import CheckForRedirect from '@/app/_components/CheckForRedirect';
import Intro from '@/app/_components/Intro';
import Screen from '@/app/_components/Screen';
import { Welcome } from '@/app/_components/Welcome/Welcome';

export const metadata = {
  title: {
    absolute:
      'Interweb.WTF | A privacy-focused, user-centric link shortener for the modern interweb.',
  },
};

export default function HomePage() {
  return (
    <Screen>
      <Center h="100%" w="100%">
        <Stack align="center" w="100%" maw="780">
          <Welcome />
          <Intro />
        </Stack>
      </Center>
      <CheckForRedirect />
    </Screen>
  );
}
