import { headers } from 'next/headers';
import { Anchor, Avatar, Badge, Group, Image, Indicator, Pill, Text, Title } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';
import UnknownShortener from '@/app/_components/UnknownShortener';
import { KNOWN_SHORTENERS, KNOWN_TRACKING_PARAM_PREFIXES } from '@/constants';

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

  const getContent = async (url: URL): Promise<Record<string, any>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.toString(), userAgent }),
    }).then(async (res) => {
      return await res.json();
    });

    return response;
  };

  const parseMetadata = (metadata: Record<string, any>): void => {
    console.log(metadata);
  };

  const { status, url: fullUrl, redirected, headers: requestHeaders } = await getUrlInfo(url);

  const contentType = requestHeaders.get('content-type');

  const { metadata, screenshotPath, favicons } = await getContent(url);

  const charset =
    metadata.find((meta: Record<string, any>) => {
      return meta?.charset;
    })?.charset ?? 'unknown';

  parseMetadata(metadata);

  const displayUrl = new URL(fullUrl);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

  let imageSrc;

  try {
    const { data } = await supabase.storage
      .from('inspector-screenshots')
      .getPublicUrl(screenshotPath);
    imageSrc = data?.publicUrl;
  } catch (error) {
    console.error(error);
  }

  const pillColor = status >= 200 && status < 400 ? 'green' : 'red';
  const shortLinkProvider = url.hostname;

  const renderDescription = (metadata: Array<Record<string, any>>): React.ReactNode => {
    const descriptions = metadata.filter(
      (meta) =>
        meta?.name === 'description' ||
        (typeof meta?.property !== 'undefined' && meta.property.endsWith(':description'))
    );

    if (descriptions.length === 0) {
      return null;
    }

    // prefer og:description -> description -> twitter:description
    if (descriptions.find((meta) => meta?.property === 'og:description')) {
      return (
        <Text>{descriptions.find((meta) => meta?.property === 'og:description')?.content}</Text>
      );
    }

    if (descriptions.find((meta) => meta?.name === 'description')) {
      return <Text>{descriptions.find((meta) => meta?.name === 'description')?.content}</Text>;
    }

    if (descriptions.find((meta) => meta?.property === 'twitter:description')) {
      return (
        <Text>
          {descriptions.find((meta) => meta?.property === 'twitter:description')?.content}
        </Text>
      );
    }
  };

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

  return (
    <Screen
      title={
        favicons?.[0] ? (
          <Group>
            <Text span inherit>
              Shortlink Inspector
            </Text>
            <Indicator inline label={shortLinkProvider} size={16}>
              <Avatar src={favicons?.[0]} radius={0} size="sm" />
            </Indicator>
          </Group>
        ) : (
          <Indicator inline label={shortLinkProvider} size={16}>
            <Text span inherit>
              Shortlink Inspector
            </Text>
          </Indicator>
        )
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
          <Pill radius="xs">{charset}</Pill>
        </Group>
      </Title>
      {redirected && (
        <Text>The destination of this shortened URL was redirected while retrieving the URL.</Text>
      )}
      {imageSrc && (
        <Anchor rel="noreferrer" href={displayUrlNoQueryParams.toString()} underline="never">
          <Image
            radius="sm"
            src={imageSrc}
            alt={`Screenshot of ${displayUrlNoQueryParams.toString()}`}
          />
        </Anchor>
      )}
      {metadata && renderDescription(metadata)}
      <Title order={3}>URL Parameters</Title>
      <Group>{renderSearchParams(displayUrl)}</Group>
    </Screen>
  );
}
