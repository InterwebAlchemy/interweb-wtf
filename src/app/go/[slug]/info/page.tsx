import { IconAppWindow, IconQrcode, IconWorldWww } from '@tabler/icons-react';
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
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import QRCode from '@/app/_components/QRCode';
import Screen from '@/app/_components/Screen';
import UrlMetadata from '@/app/_components/UrlMetadata';

import '@/app/_styles/info.css';

type Params = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const supabase = await createClient();

  const slug = (await params).slug;

  const {
    data: { id, url },
  } = await supabase.from('short_urls').select('*').eq('slug', slug).single();

  const {
    data: { title, description, metadata, screenshot, favicon },
  } = await supabase.from('url_info').select('*').eq('url_id', id).single();

  let imageSrc: string = '';

  try {
    const { data } = await supabase.storage.from('inspector-screenshots').getPublicUrl(screenshot);
    imageSrc = data?.publicUrl;
  } catch (_error) {
    void 0;
  }

  return {
    metadataBase: url,
    generator: 'Interweb.WTF',
    applicationName: 'Interweb.WTF',
    title,
    description,
    referrer: '',
    icons: {
      icon: favicon,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: imageSrc,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [imageSrc],
    },
    ...metadata,
  };
}

export default async function InspectorPage({ params }: { params: Promise<Params> }) {
  const supabase = await createClient();

  const slug = (await params).slug;

  const shortUrl = new URL(`/go/${slug}`, process.env.NEXT_PUBLIC_APPLICATION_URL);

  const {
    data: { id, url },
  } = await supabase.from('short_urls').select('*').eq('slug', slug).single();

  const {
    data: { title, description, metadata, screenshot, favicon },
  } = await supabase.from('url_info').select('*').eq('url_id', id).single();

  let summary: string;

  // TODO: render summary as Markdown
  const { data: summaryData } = await supabase
    .from('url_summaries')
    .select('*')
    .eq('url_id', id)
    .single();

  if (summaryData && summaryData?.summary) {
    summary = summaryData?.summary;
  }

  const displayUrl = new URL(url);

  const displayUrlNoQueryParams = new URL(displayUrl.pathname, displayUrl.origin);

  const language =
    metadata.find((meta: Record<string, any>) => {
      return meta?.language;
    })?.language ?? 'unknown';

  let imageSrc: string;

  try {
    const { data } = await supabase.storage.from('inspector-screenshots').getPublicUrl(screenshot);
    imageSrc = data?.publicUrl;
  } catch (_error) {
    void 0;
  }

  const renderScreenshotAndQrCode = (): React.ReactNode => {
    const tabList = ['details', 'qrcode'];

    return (
      <Tabs defaultValue={tabList[0]}>
        <TabsList>
          {tabList.map((tab) => (
            <TabsTab
              key={tab}
              value={tab}
              leftSection={
                tab === 'details' ? <IconAppWindow size={20} /> : <IconQrcode size={20} />
              }
            >
              {tab === 'details' ? 'Details' : 'QR Code'}
            </TabsTab>
          ))}
        </TabsList>
        {tabList.map((tab) => (
          <TabsPanel key={tab} value={tab}>
            {tab === 'details' ? (
              <Stack>
                <Center w="80%" mx="auto" my="md" pos="relative">
                  <Anchor
                    id="page-screenshot"
                    rel="noreferrer"
                    href={displayUrl.toString()}
                    underline="never"
                  >
                    <Image
                      radius="sm"
                      src={imageSrc}
                      alt={`Screenshot of ${displayUrlNoQueryParams.toString()}`}
                      mah={600}
                      mih={200}
                    />
                  </Anchor>
                </Center>
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
                {displayUrl.searchParams.size > 0 && (
                  <Stack>
                    <Title order={3}>URL Parameters</Title>
                    <Group>{renderSearchParams(displayUrl)}</Group>
                  </Stack>
                )}
              </Stack>
            ) : (
              <Center w="80%" mx="auto" my="md" pos="relative">
                <QRCode url={shortUrl.toString()} title={title} />
              </Center>
            )}
          </TabsPanel>
        ))}
      </Tabs>
    );
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
          <Text span inherit fw={300} tt="initial">
            {value}
          </Text>
        </Badge>
      );
    });
  };

  return (
    <Screen
      title={
        <Group align="center">
          <Text span inherit>
            WTF Link Inspector
          </Text>
          <Button
            color="violet"
            component="a"
            href={displayUrl.toString()}
            title="Go to full URL"
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
      <Title order={2} lineClamp={3}>
        <Group align="center">
          {title}
          {title && language !== 'unknown' && (
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
        </Group>
      </Title>
      <UrlMetadata url={url} />
      {renderScreenshotAndQrCode()}
    </Screen>
  );
}
