import { Center, Stack } from '@mantine/core';
import CheckForRedirect from '@/app/_components/CheckForRedirect';
import Intro from '@/app/_components/Intro';
import Screen from '@/app/_components/Screen';
import { Welcome } from '@/app/_components/Welcome/Welcome';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APPLICATION_URL!),
  title: {
    absolute: 'Interweb.WTF | Shortlinks you can trust',
  },
  authors: [{ name: 'Interweb Alchemy', url: 'https://interwebalchemy.com/' }],
  description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
  generator: 'Interweb.WTF',
  applicationName: 'Interweb.WTF',
  referrer: '',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Interweb.WTF',
    description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
    url: 'https://interweb.wtf',
    images: ['/interweb-wtf.png', '/assets/wtf-patient-recipe.png', '/favicon.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Interweb.WTF',
    description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
    images: ['/interweb-wtf.png', '/assets/wtf-patient-recipe.png', '/favicon.svg'],
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
