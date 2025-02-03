import { Box, Flex, Stack, Title } from '@mantine/core';
import Nav from '@/app/_components/Nav';

export default async function DashboardPage() {
  return (
    <Box p="md">
      <Stack>
        <Nav />
        <Flex align="center">
          <Title order={2}>Dashboard</Title>
        </Flex>
      </Stack>
    </Box>
  );
}
