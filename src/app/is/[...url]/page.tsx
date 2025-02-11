import { headers } from 'next/headers';
import { IconWorldWww } from '@tabler/icons-react';
import {
  Anchor,
  Avatar,
  Badge,
  Blockquote,
  Button,
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
import { getTrackingParams, removeTrackingParams } from '@/app/_utils/url';
import { getPageDescription, getPageTitle } from '@/app/_utils/webpage';
import { KNOWN_SHORTENERS } from '@/constants';

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

    const trackers = getTrackingParams(url);

    return searchParams.entries().map(([key, value]) => {
      let trackingParam = false;

      if (trackers.some((tracker) => tracker[key])) {
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
          title={trackingParam ? 'This is a known tracking parameter' : ''}
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

  const cleanUrl = removeTrackingParams(displayUrl);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

  if (status >= 200 && status < 400) {
    const { metadata, screenshotPath, favicon } = await getContent(displayUrl, url);

    const charset =
      metadata.find((meta: Record<string, any>) => {
        return meta?.charset;
      })?.charset ?? 'unknown';

    const language =
      metadata.find((meta: Record<string, any>) => {
        return meta?.language;
      })?.language ?? 'unknown';

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

    const title = getPageTitle(metadata);
    const description = getPageDescription(metadata);

    return (
      <Screen
        title={
          <Group align="center">
            <Text span inherit>
              WTF Link Inspector
            </Text>
            {status >= 200 && status < 400 ? (
              <Button
                color="violet"
                component="a"
                href={cleanUrl.toString()}
                title="Go to full URL"
                rel="noreferrer"
                ml="auto"
                leftSection={<IconWorldWww size={20} />}
                style={{ color: 'white' }}
                tt="uppercase"
              >
                Visit
              </Button>
            ) : (
              <></>
            )}
          </Group>
        }
      >
        <Title order={2} lineClamp={3}>
          {title}
        </Title>
        {imageSrc && (
          <Center w="80%" mx="auto" my="md" pos="relative">
            <Anchor
              id="page-screenshot"
              rel="noreferrer"
              href={cleanUrl.toString()}
              underline="never"
            >
              <Image
                radius="sm"
                src={imageSrc}
                alt={`Screenshot of ${displayUrlNoQueryParams.toString()}`}
                mih={600}
              />
            </Anchor>
          </Center>
        )}
        {description && (
          <Center w="90%" mx="auto" my="md" maw="640">
            <Blockquote
              radius="xs"
              iconSize={30}
              cite={`- ${title ? title : displayUrlNoQueryParams.toString()}`}
              icon={favicon ? <Avatar src={favicon} radius="xs" size="md" /> : <></>}
            >
              {description}
            </Blockquote>
          </Center>
        )}
        <Group align="center" justify="center" w="100%">
          <Badge
            color="white"
            bg={pillColor}
            leftSection={
              <Text span inherit fw={300}>
                Status:
              </Text>
            }
            radius="sm"
          >
            <Text span inherit fw={700}>
              {status}
            </Text>
          </Badge>
          {language !== 'unknown' && (
            <Badge
              variant="light"
              color="gray"
              leftSection={
                <Text span inherit fw={300}>
                  Language:
                </Text>
              }
              radius="sm"
            >
              <Text span inherit fw={700} tt="initial">
                {language}
              </Text>
            </Badge>
          )}
          <Badge
            variant="light"
            color="gray"
            leftSection={
              <Text span inherit fw={300}>
                Content-Type:
              </Text>
            }
            radius="sm"
          >
            <Text span inherit fw={700}>
              {contentType}
            </Text>
          </Badge>
          {charset !== 'unknown' && !contentType?.includes('charset') && (
            <Badge
              variant="light"
              color="gray"
              leftSection={
                <Text span inherit fw={300}>
                  Charset:
                </Text>
              }
              radius="sm"
            >
              <Text span inherit fw={700}>
                {charset}
              </Text>
            </Badge>
          )}
        </Group>
        {redirected && (
          <Text>
            <Text span inherit fw={700}>
              Note:
            </Text>
            The destination of this shortened URL was redirected while retrieving the URL.
          </Text>
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
              href={cleanUrl.toString()}
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
