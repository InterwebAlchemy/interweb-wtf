import { headers } from 'next/headers';
import { IconWorldWww } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Blockquote,
  Center,
  Group,
  Image,
  Indicator,
  Pill,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';
import UnknownShortener from '@/app/_components/UnknownShortener';
import { getPageDescription, getPageTitle } from '@/app/_utils/webpage';
import { KNOWN_SHORTENERS, KNOWN_TRACKING_PARAM_PREFIXES } from '@/constants';

import '@/app/_styles/info.css';

type Params = {
  params: Promise<{
    url: string[];
  }>;
};

export default async function InspectorPage({ params }: Params) {
  const supabase = await createClient();

  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
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

  if (!KNOWN_SHORTENERS.includes(url.hostname)) {
    return (
      <Screen>
        <UnknownShortener url={url} />
      </Screen>
    );
  }

  const getUrlInfo = async (url: URL): Promise<Response> => {
    const response = await fetch(url.href);

    return response;
  };

  const getContent = async (url: URL, shortUrl: URL): Promise<Record<string, any>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/expand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.toString(), userAgent, shortUrl: shortUrl.toString() }),
    }).then(async (res) => {
      return await res.json();
    });

    return response;
  };

  // TODO: grab extra details from metadata
  // const parseMetadata = (metadata: Record<string, any>): void => {
  //   console.log(metadata);
  // };

  const renderSearchParams = (url: URL): React.ReactNode => {
    const searchParams = url.searchParams;

    return searchParams.entries().map(([key, value]) => {
      let trackingParam = false;

      if (KNOWN_TRACKING_PARAM_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        trackingParam = true;
      }

      return (
        <Badge
          variant={trackingParam ? 'outline' : 'light'}
          color={trackingParam ? 'red' : 'gray'}
          key={key}
          leftSection={
            <Text span inherit fw={700}>
              {key}:
            </Text>
          }
          radius="sm"
        >
          <Text span inherit fw={300}>
            {value}
          </Text>
        </Badge>
      );
    });
  };

  const { status, url: fullUrl, redirected, headers: requestHeaders } = await getUrlInfo(url);

  const contentType = requestHeaders.get('content-type');

  const pillColor = status >= 200 && status < 400 ? 'green' : 'red';

  const shortLinkProvider = url.hostname;

  const displayUrl = new URL(fullUrl);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

  if (status >= 200 && status < 400) {
    const { metadata, screenshotPath, favicon } = await getContent(displayUrl, url);

    const charset =
      metadata.find((meta: Record<string, any>) => {
        return meta?.charset;
      })?.charset ?? 'unknown';

    // TODO: grab extra details from metadata
    // parseMetadata(metadata);

    let imageSrc;

    try {
      const { data } = await supabase.storage
        .from('inspector-screenshots')
        .getPublicUrl(screenshotPath);
      imageSrc = data?.publicUrl;
    } catch (error) {
      console.error(error);
    }

    const description = getPageDescription(metadata);

    const isImageDescription =
      description.startsWith('http') &&
      (description.endsWith('.jpg') ||
        description.endsWith('.png') ||
        description.endsWith('.jpeg') ||
        description.endsWith('.gif') ||
        description.endsWith('.webp') ||
        description.endsWith('.svg'));

    return (
      <Screen
        title={
          <Group align="center">
            <Text span inherit>
              Shortlink Expander
            </Text>
            <Badge>{shortLinkProvider}</Badge>
            {status >= 200 && status < 400 ? (
              <Anchor href={fullUrl} title="Go to full URL" rel="noreferrer" ml="auto">
                <ActionIcon bg="violet">
                  <IconWorldWww />
                </ActionIcon>
              </Anchor>
            ) : (
              <></>
            )}
          </Group>
        }
      >
        <Title order={2}>{getPageTitle(metadata)}</Title>
        <Title order={3}>
          <Group wrap="nowrap" align="center">
            <Pill c="white" bg={pillColor} radius="xs">
              {status}
            </Pill>
            <Text span inherit truncate="end">
              <Anchor
                rel="noreferrer"
                href={displayUrlNoQueryParams.toString()}
                underline="hover"
                style={{ display: 'flex' }}
              >
                {displayUrlNoQueryParams.toString()}
              </Anchor>
            </Text>
            <Pill radius="xs">{contentType}</Pill>
            <Pill radius="xs">{charset}</Pill>
          </Group>
        </Title>
        {redirected && (
          <Text>
            The destination of this shortened URL was redirected while retrieving the URL.
          </Text>
        )}
        {imageSrc && (
          <Anchor
            id="page-screenshot"
            rel="noreferrer"
            href={displayUrlNoQueryParams.toString()}
            underline="never"
          >
            <Image
              radius="sm"
              src={imageSrc}
              alt={`Screenshot of ${displayUrlNoQueryParams.toString()}`}
            />
          </Anchor>
        )}
        <Center my="md">
          <Blockquote
            cite={`- ${displayUrlNoQueryParams.toString()}`}
            icon={favicon ? <Avatar src={favicon} radius={0} size="sm" /> : <></>}
          >
            {isImageDescription ? (
              <Image
                src={description}
                alt={`Screenshot of ${displayUrlNoQueryParams.toString()}`}
              />
            ) : (
              description
            )}
          </Blockquote>
        </Center>
        {displayUrl.searchParams.size > 0 && (
          <Stack>
            <Title order={3}>URL Parameters</Title>
            <Group>{renderSearchParams(displayUrl)}</Group>
          </Stack>
        )}
      </Screen>
    );
  }

  return (
    <Screen
      title={
        <Indicator inline label={shortLinkProvider} size={16}>
          <Text span inherit>
            Shortlink Expander
          </Text>
        </Indicator>
      }
    >
      <Title order={1}>
        <Group wrap="nowrap" align="center">
          <Pill c="white" bg={pillColor} radius="xs">
            {status}
          </Pill>
          <Text span inherit truncate="end">
            <Anchor
              rel="noreferrer"
              href={displayUrlNoQueryParams.toString()}
              underline="hover"
              style={{ display: 'flex' }}
            >
              {displayUrlNoQueryParams.toString()}
            </Anchor>
          </Text>
          <Pill radius="xs">{contentType}</Pill>
        </Group>
      </Title>
      {redirected && (
        <Text>The destination of this shortened URL was redirected while retrieving the URL.</Text>
      )}
      {displayUrl.searchParams.size > 0 && (
        <Stack>
          <Title order={3}>URL Parameters</Title>
          <Group>{renderSearchParams(displayUrl)}</Group>
        </Stack>
      )}
    </Screen>
  );
}
