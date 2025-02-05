import { Box, Container, Stack, Title } from '@mantine/core';
import Nav from '@/app/_components/Nav';

export interface ScreenProps {
  title?: string;
}

export default async function Screen({ children, ...props }: React.PropsWithChildren<ScreenProps>) {
  const { title } = props;

  return (
    <Container fluid>
      <Box p="md">
        <Stack>
          <Nav />
          <Stack>
            {title ? <Title order={2}>{title}</Title> : <></>}
            {children}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
