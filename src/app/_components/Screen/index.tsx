import { redirect, RedirectType } from 'next/navigation';
import { Flex, Stack, Title, type TitleProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { createClient } from '@/app/_adapters/supabase/server';
import Footer from '@/app/_components/Footer';
import Nav from '@/app/_components/Nav';

export interface ScreenProps {
  title?: React.ReactNode | string;
  titleProps?: TitleProps;
  authenticated?: boolean;
  // HACK: This is a hack to allow layouts and pages to pass arbitrary props to the Screen component
  // TODO: Use better types and remove this hack
  [key: string]: any;
}

export default async function Screen({
  children,
  title,
  titleProps,
  authenticated = false,
  ...props
}: React.PropsWithChildren<ScreenProps>) {
  const supabase = await createClient();

  if (authenticated) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect('/login', RedirectType.replace);
    }
  }

  return (
    <>
      <Notifications position="bottom-right" />
      <Flex
        h="100%"
        p="lg"
        w="100%"
        direction="column"
        justify="flex-start"
        align="flex-start"
        mih="100vh"
        {...props}
      >
        <Stack h="100%" w="100%">
          <Nav />
          <Stack w="100%">
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
      </Flex>
    </>
  );
}
