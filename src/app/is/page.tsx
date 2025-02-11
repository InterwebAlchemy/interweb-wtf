import { Center } from '@mantine/core';
import Screen from '@/app/_components/Screen';
import UrlExpander from '@/app/_components/UrlExpander';

export default async function BlankInspectorPage() {
  return (
    <Screen title="ShortLink Expander">
      <Center h="80%" w="100%" mx="auto" maw="640">
        <UrlExpander />
      </Center>
    </Screen>
  );
}
