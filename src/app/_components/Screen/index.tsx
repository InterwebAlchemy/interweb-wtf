import { Container, Stack, Title, type TitleProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Footer from '@/app/_components/Footer';
import Nav from '@/app/_components/Nav';

export interface ScreenProps {
  title?: string | React.ReactNode;
  titleProps?: TitleProps;
}

export default async function Screen({ children, ...props }: React.PropsWithChildren<ScreenProps>) {
  const { title, titleProps = {} } = props;

  return (
    <>
      <Notifications position="bottom-right" />
      <Container fluid h="100%" p="lg" display="flex" w="100%">
        <Stack h="100%" w="100%">
          <Nav />
          <Stack h="100%" w="100%">
            {title ? (
              <Title order={1} {...titleProps} mb={40}>
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
    </>
  );
}
