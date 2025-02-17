import { Center } from '@mantine/core';
import Screen from '@/app/_components/Screen';
import UrlCleaner from '@/app/_components/UrlCleaner';

export default async function CleanUrlPage() {
  return (
    <Screen title="Link Cleaner">
      <Center h="100%" w="100%" mx="auto" maw="640">
        <UrlCleaner />
      </Center>
    </Screen>
  );
}
