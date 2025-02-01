import { Center, Flex } from '@mantine/core';
import Login from '@/app/_components/Login';
import { Welcome } from '@/app/_components/Welcome/Welcome';

export default function HomePage() {
  return (
    <Center>
      <Flex direction="column" align="center">
        <Welcome />
        <Login />
      </Flex>
    </Center>
  );
}
