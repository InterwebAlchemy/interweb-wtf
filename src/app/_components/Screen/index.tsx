import { Container, Stack, Title, type TitleProps } from '@mantine/core';
import Footer from '@/app/_components/Footer';
import Nav from '@/app/_components/Nav';

export interface ScreenProps {
  title?: string | React.ReactNode;
  titleProps?: TitleProps;
}

export default async function Screen({ children, ...props }: React.PropsWithChildren<ScreenProps>) {
  const { title, titleProps = {} } = props;

  return (
    <Container fluid h="100%" p="md" display="flex" w="100%">
      <Stack h="100%" w="100%">
        <Nav />
        <Stack h="100%">
          {title ? (
            <Title order={1} {...titleProps}>
              {title}
            </Title>
          ) : (
            <></>
          )}
          {children}
        </Stack>
        <Footer />
      </Stack>
    </Container>
  );
}
