import Link from 'next/link';
import { Anchor, Flex, Text, Title } from '@mantine/core';
import CipherText from '@/app/_components/CipherText';
import { generateSlug } from '@/app/_services/url';

export function Welcome() {
  const url = new URL(process.env.NEXT_PUBLIC_APPLICATION_URL ?? 'interweb.wtf');

  const displayUrl = url.hostname.split('.').slice(-2).join('.');

  return (
    <>
      <Title order={1} mt="50" mb="50" size="h1" ta="left" w="100%">
        Simple.{' '}
        <Anchor inherit c="violet" td="underline" href="/is" component={Link}>
          Inspectable
        </Anchor>
        {'. '}
        <Anchor inherit c="violet" td="underline" href="/clean" component={Link}>
          Private
        </Anchor>
        {'. '}
        Shortlinks.
      </Title>
      <Title order={2} mb="20" textWrap="balance" ta="left" w="100%">
        <Flex w="100%" direction={{ base: 'column', md: 'row' }}>
          <Text span inherit c="gray">
            {displayUrl}
          </Text>
          <Text span inherit c="violet" size="md">
            /go/
            <CipherText defaultText={generateSlug()} speed={50} />
          </Text>
          <Text span inherit c="gray">
            /info
          </Text>
        </Flex>
      </Title>
    </>
  );
}
