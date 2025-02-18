import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { IconWorldBolt, IconWorldWww } from '@tabler/icons-react';
import { Badge, Button, Group, Text, Title } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';
import UnknownShortener from '@/app/_components/UnknownShortener';
import UrlDescription from '@/app/_components/UrlDescription';
import UrlMetadata from '@/app/_components/UrlMetadata';
import UrlParams from '@/app/_components/UrlParams';
import UrlScreenshot from '@/app/_components/UrlScreenshot';
import { removeTrackingParams } from '@/app/_utils/url';
import { getPageDescription, getPageTitle } from '@/app/_utils/webpage';
import { KNOWN_SHORTENERS } from '@/constants';

import '@/app/_styles/info.css';

type Params = {
  params: Promise<{
    url: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function ExpanderPage({ params, searchParams }: Params) {
  const supabase = await createClient();

  const headersList = await headers();

  let userAgent = headersList.get('user-agent');

  if (!userAgent) {
    // Fallback to a common user agent
    // taken from: https://www.useragents.me/ 2025-02-16
    userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.3`;
  }

  let fullUrl;

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

  if (!KNOWN_SHORTENERS.includes(url.hostname)) {
    return (
      <Screen>
        <UnknownShortener url={url.toString()} />
      </Screen>
    );
  }

  const { data, error } = await supabase
    .from('expanded_urls')
    .select('*')
    .eq('short_url', url.toString())
    .single();

  if (error || !data) {
    const apiUrl = new URL('/api/fetch', process.env.NEXT_PUBLIC_APPLICATION_URL);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.toString() }),
    }).then(async (res) => {
      return await res.json();
    });

    if (response.error) {
      return notFound();
    }

    fullUrl = new URL(response.url);
  } else {
    fullUrl = new URL(data.expanded_url);
  }

  const getContent = async (url: URL, shortUrl: URL): Promise<Record<string, any>> => {
    const apiUrl = new URL('/api/expand', process.env.NEXT_PUBLIC_APPLICATION_URL);

    const response = await fetch(apiUrl, {
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

  const shortLinkProvider = url.hostname;

  const displayUrl = new URL(fullUrl);

  const cleanUrl = removeTrackingParams(displayUrl);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

  const { metadata, screenshotPath, favicon } = await getContent(displayUrl, url);

  const language =
    metadata?.find((meta: Record<string, any>) => {
      return meta?.language;
    })?.language ?? 'unknown';

  let imageSrc;

  try {
    if (screenshotPath) {
      const { data } = await supabase.storage
        .from('inspector-screenshots')
        .getPublicUrl(screenshotPath);

      imageSrc = data?.publicUrl;
    }
  } catch (_error) {
    void 0;
  }

  const title = getPageTitle(metadata);
  const description = getPageDescription(metadata);

  return (
    <Screen
      title={
        <Group align="center">
          <Text span inherit>
            Shortlink Expander
          </Text>
          <Button
            color="violet"
            component="a"
            href={cleanUrl.toString()}
            title={`Go to ${cleanUrl.toString()}`}
            rel="noreferrer"
            ml="auto"
            leftSection={<IconWorldWww size={20} />}
            style={{ color: 'white' }}
            tt="uppercase"
          >
            Visit
          </Button>
        </Group>
      }
    >
      <Title order={2} lineClamp={3} mb={10}>
        {title && title !== 'undefined' ? title : displayUrlNoQueryParams.toString()}
      </Title>
      <UrlMetadata url={cleanUrl.toString()}>
        <Badge variant="light" color="gray" leftSection={<IconWorldBolt size={12} />} radius="sm">
          <Text span inherit fw={700} title={url.toString()}>
            {shortLinkProvider}
          </Text>
        </Badge>
        {language !== 'unknown' && (
          <Badge
            variant="light"
            color="gray"
            leftSection={
              <Text span inherit fw={300}>
                Lang:
              </Text>
            }
            radius="sm"
          >
            <Text span inherit fw={700} tt="initial">
              {language}
            </Text>
          </Badge>
        )}
      </UrlMetadata>
      <UrlScreenshot url={cleanUrl.toString()} src={imageSrc} />
      <UrlDescription
        url={cleanUrl.toString()}
        description={description}
        title={title}
        favicon={favicon}
      />
      <UrlParams url={displayUrl.toString()} />
    </Screen>
  );
}
