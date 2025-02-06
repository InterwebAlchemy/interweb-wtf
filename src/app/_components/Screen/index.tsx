import { Box, Container, Stack, Title } from '@mantine/core';
import Nav from '@/app/_components/Nav';

export interface ScreenProps {
  title?: string;
}

export default async function Screen({ children, ...props }: React.PropsWithChildren<ScreenProps>) {
  const { title } = props;

  return (
    <Container fluid h="100%" p={0}>
      <Box p="md" h="100%">
        <Stack h="100%">
          <Nav />
          <Stack h="100%">
            {title ? <Title order={2}>{title}</Title> : <></>}
            {children}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
