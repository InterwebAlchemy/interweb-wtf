import { IconWorldWww } from '@tabler/icons-react';
import {
  Anchor,
  Avatar,
  Badge,
  Blockquote,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import Screen from '@/app/_components/Screen';

import '@/app/_styles/info.css';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function InspectorPage({ params }: Params) {
  const supabase = await createClient();

  const slug = (await params).slug;

  const {
    data: { id, url },
  } = await supabase.from('short_urls').select('*').eq('slug', slug).single();

  const {
    data: { title, description, metadata, screenshot, favicon },
  } = await supabase.from('url_info').select('*').eq('url_id', id).single();

  // TODO: render summary as Markdown
  const {
    data: { summary },
  } = await supabase.from('url_summaries').select('*').eq('url_id', id).single();

  const getUrlInfo = async (url: URL): Promise<Response> => {
    const response = await fetch(url.href);

    return response;
  };

  const renderSearchParams = (url: URL): React.ReactNode => {
    const searchParams = url.searchParams;

    return searchParams.entries().map(([key, value]) => {
      return (
        <Badge
          variant="light"
          color="gray"
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

  const {
    status,
    url: fullUrl,
    redirected,
    headers: requestHeaders,
  } = await getUrlInfo(new URL(url));

  const contentType = requestHeaders.get('content-type');

  const pillColor = status >= 200 && status < 400 ? 'green' : 'red';

  const displayUrl = new URL(fullUrl);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

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
    const { data } = await supabase.storage.from('inspector-screenshots').getPublicUrl(screenshot);
    imageSrc = data?.publicUrl;
  } catch (error) {
    console.error(error);
  }

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
              href={fullUrl}
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
            href={displayUrlNoQueryParams.toString()}
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
      {summary && (
        <Center w="80%" mx="auto" my="md">
          <Stack>
            <Spoiler showLabel="More" hideLabel="Less">
              {summary}
            </Spoiler>

            <Anchor
              href="https://help.kagi.com/kagi/api/summarizer.html"
              ml="auto"
              c="gray"
              size="xs"
            >
              <Flex align="center" justify="start">
                <Image display="inline" src="/assets/kagi.png" h={14} w="auto" mr="xs" />
                <Text span>Powered by Kagi</Text>
              </Flex>
            </Anchor>
          </Stack>
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
