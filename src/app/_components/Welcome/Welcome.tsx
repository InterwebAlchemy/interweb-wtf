import { Title } from '@mantine/core';
import CipherText from '../CipherText';

const demoLinks = ['prompt-injection'];

export function Welcome() {
  return (
    <>
      <Title order={1} ta="center" mt={100}>
        interweb.wtf/is/
        <CipherText text={demoLinks[0]} speed={50} />
      </Title>
    </>
  );
}
