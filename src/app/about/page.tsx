import Link from 'next/link';
import { Anchor, Center, Code, Stack, Text, Title } from '@mantine/core';
import Screen from '../_components/Screen';

export default function AboutPage() {
  return (
    <Screen title="About">
      <Center w="100%" h="100%">
        <Stack w="100%" maw={480}>
          <Title order={2}>
            <Text inherit span c="violet">
              Interweb.WTF
            </Text>{' '}
            is a link shortening service that puts end users and privacy first.
          </Title>
          <Text>
            There is no tracking. There are no ads. We only use{' '}
            <Text span inherit fw={700}>
              one cookie with one single value
            </Text>{' '}
            just to know if you want to see the information about the URL that an{' '}
            <Code>interweb.wtf/go/</Code> link points to before we take you to the WTF Link's
            destination. You can always see where a WTF Link points to by appending{' '}
            <Code>/info</Code> to the end of the WTF Link's URL.
          </Text>
          <Title order={3}>Making Shortlinks Better</Title>
          <Text>
            We're so commited to the goal of making shortlinks good for the end user who clicks on
            them that we even provide a safe{' '}
            <Anchor href="/is" component={Link}>
              shortlink expander
            </Anchor>{' '}
            for other link shortening services. Our shortlink expander removes any known tracking
            parameters from the URL, resolves any redirects, checks the HTTP status code of the URL,
            and provides a preview of the URL's content.
          </Text>
          <Title order={3}>Removing Tracking Parameters</Title>
          <Text>
            We're so committed to the goal of respecting user privacy that we automatically clean
            known tracking parameters from URLs before creating WTF Links for them and after
            expanding shortlinks from other providers, and we even provide a free{' '}
            <Anchor href="/clean" component={Link}>
              URL cleaner
            </Anchor>{' '}
            that removes any known tracking, targeting, and analytics parameters from any
            user-provided URL.
          </Text>
        </Stack>
      </Center>
    </Screen>
  );
}
