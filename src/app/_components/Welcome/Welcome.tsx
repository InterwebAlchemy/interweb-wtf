import Link from 'next/link';
import Haikunator from 'haikunator';
import { Anchor, Text, Title } from '@mantine/core';
import CipherText from '../CipherText';

const haikunator = new Haikunator();

export function Welcome() {
  const slug = haikunator.haikunate({ tokenLength: 0 });

  const url = new URL(process.env.NEXT_PUBLIC_APPLICATION_URL ?? 'interweb.wtf');

  return (
    <>
      <Title order={1} mb="100">
        Simple.{' '}
        <Anchor inherit c="violet" td="underline" href="/is" component={Link}>
          Inspectable
        </Anchor>
        {'. '}
        Shortlinks.
      </Title>
      <Title order={2} size="h3">
        {url.hostname}/go
        <Text span inherit c="violet">
          /<CipherText text={slug} speed={50} />
        </Text>
        <Text span inherit c="gray">
          /<CipherText text="info" speed={100} />
        </Text>
      </Title>
    </>
  );
}
