import Link from 'next/link';
import { Anchor, Center, Flex, Text } from '@mantine/core';
import CleanedUrl from '@/app/_components/CleanedUrl';
import Screen from '@/app/_components/Screen';
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
      <Flex h="100%" w="100%" maw="640px" justify="center" align="center" mx="auto">
        <CleanedUrl cleanedUrl={cleanedUrl.toString()} originalUrl={url.toString()} />
      </Flex>
    </Screen>
  );
}
