import { Anchor, Center, Code, Stack, Text, Title } from '@mantine/core';
import CookieInspector from '@/app/_components/CookieInspector';
import Screen from '@/app/_components/Screen';

export default async function PrivacyPage() {
  return (
    <Screen title="Privacy Policy">
      <Center w="100%" h="100%">
        <Stack w="100%" maw={480}>
          <Text>
            When you create an account, you grant{' '}
            <Text span inherit c="violet">
              Interweb.WTF
            </Text>{' '}
            access to use your GitHub account for authorization via{' '}
            <Anchor href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps">
              OAuth
            </Anchor>
            , you allow us to see your GitHub username and default email address. This is the only
            information we store about you while your account is active.
          </Text>
          <Text fw={700}>We never share this information with any third parties.</Text>
          <Text>
            We use this information to identify you when you log in and may occasionally send you
            critical notifications about the{' '}
            <Text span inherit c="violet">
              Interweb.WTF
            </Text>{' '}
            service or your account, but we rarely send any correspondence.
          </Text>
          <Title order={2}>Cookies</Title>
          <Text>
            We do not use any tracking cookies or 3rd party cookies. If you choose to disable the{' '}
            <Code>Skip the Inspector</Code> functionality, we will store a single cookie on your
            device to remember your preference for the current browser. We only use this cookie to
            determine whether to show you the WTF Link Inspector or direct you automatically to the
            destination of a the WTF Link. You can always append <Code>/info</Code> to any WTF Link
            to view the WTF Link Inspector for it.
          </Text>
          <CookieInspector />
        </Stack>
      </Center>
    </Screen>
  );
}
