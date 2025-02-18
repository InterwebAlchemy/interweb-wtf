import { Anchor, Center, Image, Skeleton } from '@mantine/core';

export interface UrlScreenshotProps {
  url: string | URL;
  src?: string;
}

export default function UrlScreenshot({ url, src }: UrlScreenshotProps): React.ReactElement {
  return (
    <Center w="80%" mx="auto" my="md" pos="relative">
      <Anchor
        w="100%"
        h="100%"
        id="page-screenshot"
        rel="noreferrer"
        href={url.toString()}
        underline="never"
      >
        <Skeleton h="100%" w="100%" visible={typeof src === 'undefined'} mih={240}>
          <Image radius={0} src={src} alt={`Screenshot of ${url.toString()}`} mih={240} />
        </Skeleton>
      </Anchor>
    </Center>
  );
}
