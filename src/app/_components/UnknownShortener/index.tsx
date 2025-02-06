import { Anchor, Stack, Title } from '@mantine/core';

export interface UnknownShortenerProps {
  url: string | URL;
}

export default function UnknownShortener({ url }: UnknownShortenerProps) {
  const shortenerUrl = new URL(url);

  return (
    <Stack align="center" h="100%" justify="center">
      <Title order={2}>
        Sorry, expanding shortened links from <strong>{shortenerUrl.hostname}</strong> is not
        supported yet.
      </Title>
      <Anchor href={process.env.NEXT_PUBLIC_SHORTENER_REQUEST_URL}>
        Request {shortenerUrl.hostname} Support
      </Anchor>
    </Stack>
  );
}
