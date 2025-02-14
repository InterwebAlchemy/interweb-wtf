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
            is a link shortening service that puts users and privacy first.
          </Title>
          <Text>
            There is no tracking. There are no ads. We only use{' '}
            <Text span inherit fw={700}>
              one cooke
            </Text>{' '}
            - that only stores one value - just to know if you want to see the information about the
            URL that an <Code>interweb.wtf/go/</Code> link points to before we take you to the
            WTFLink's destination.
          </Text>
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
        </Stack>
      </Center>
    </Screen>
  );
}
