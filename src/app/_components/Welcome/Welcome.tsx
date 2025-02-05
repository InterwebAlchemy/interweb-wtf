import Haikunator from 'haikunator';
import { Title } from '@mantine/core';
import CipherText from '../CipherText';

const haikunator = new Haikunator();

export function Welcome() {
  const slug = haikunator.haikunate({ tokenLength: 0 });

  return (
    <>
      <Title order={1} ta="center">
        interweb.wtf/is/
        <CipherText text={slug} speed={50} />
      </Title>
    </>
  );
}
