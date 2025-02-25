import Link from 'next/link';
import { IconWorldWww } from '@tabler/icons-react';
import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Button, Center, Stack, Text, Title } from '@mantine/core';
import Screen from '@/app/_components/Screen';
import UrlParams from '@/app/_components/UrlParams';
import { removeTrackingParams } from '@/app/_utils/url';
import { KNOWN_SHORTENERS } from '@/constants';

type Params = {
  params: Promise<{
    url: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function ExpanderPage({ params, searchParams }: Params) {
  const url = new URL(
    (await params).url
      .map((part, i) => {
        let formattedPart = decodeURIComponent(part);

        if (i === 0) {
          if (formattedPart.startsWith('http:') || formattedPart.startsWith('https:')) {
            formattedPart = formattedPart.replace(/[^http:|https:]/g, '');

            formattedPart = `${formattedPart}/`;
          } else {
            formattedPart = `https://${formattedPart}`;
          }
        }

        return formattedPart;
      })
      .join('/')
  );

  const queryParams = await searchParams;

  Object.entries(queryParams).forEach(([key, value]) => {
    if (typeof value !== 'undefined') {
      url.searchParams.set(key, value as string);
    }
  });

  if (KNOWN_SHORTENERS.includes(url.hostname)) {
    return (
      <Screen>
        <Center>
          <Text>
            This URL is a shortlink. Please{' '}
            <Anchor href={`/is/${url.toString()}`} component={Link}>
              expand
            </Anchor>{' '}
            it instead to receive a cleaned URL.
          </Text>
        </Center>
      </Screen>
    );
  }

  const cleanedUrl = removeTrackingParams(url);

  return (
    <Screen title="Link Cleaner">
      <Stack h="100%" w="100%" maw="640px" justify="center" align="center" mx="auto">
        <Title order={4} mt={40}>
          Cleaned URL
        </Title>
        <CodeHighlight
          code={cleanedUrl.toString()}
          copyLabel="Copy Clean URL"
          language="url"
          mb={20}
        />
        <Button
          color="violet"
          component="a"
          href={cleanedUrl.toString()}
          title={`Go to ${cleanedUrl.toString()}`}
          rel="noreferrer"
          leftSection={<IconWorldWww size={20} />}
          style={{ color: 'white' }}
          tt="uppercase"
          mb={40}
        >
          Visit
        </Button>
        <UrlParams url={url.toString()} />
      </Stack>
    </Screen>
  );
}
