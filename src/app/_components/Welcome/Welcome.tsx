import Haikunator from 'haikunator';
import { Text, Title } from '@mantine/core';
import CipherText from '../CipherText';

const haikunator = new Haikunator();

export function Welcome() {
  const slug = haikunator.haikunate({ tokenLength: 0 });

  const url = new URL(process.env.NEXT_PUBLIC_APPLICATION_URL ?? 'interweb.wtf');

  return (
    <>
      <Title order={1} mb="100">
        Simple.{' '}
        <Text span inherit c="violet" td="underline">
          Inspectable.
        </Text>{' '}
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
