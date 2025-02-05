import { Box, Flex } from '@mantine/core';
import Login from '@/app/_components/Login';
import { Welcome } from '@/app/_components/Welcome/Welcome';

export default function HomePage() {
  return (
    <Box p="md" h="100%">
      <Flex align="center" justify="center" style={{ height: '80%', marginTop: '10%' }}>
        <Flex direction="column" align="center" style={{ height: '100%' }}>
          <Welcome />
          <div style={{ marginTop: 'auto' }}>
            <Login />
          </div>
        </Flex>
      </Flex>
    </Box>
  );
}
