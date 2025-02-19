'use client';

import { Group, Stack, Title } from '@mantine/core';
import { getTrackingParams } from '@/app/_utils/url';
import UrlParam from './UrlParam';

export interface UrlParamsProps {
  url: string | URL;
  title?: string;
}

export default function UrlParams({
  url,
  title = 'URL Parameters',
}: UrlParamsProps): React.ReactElement {
  const urlObj = new URL(url.toString());

  const trackers = getTrackingParams(urlObj);

  const renderParams = (url: URL): React.ReactNode => {
    return url.searchParams.entries().map(([key, value]) => {
      let isTrackingParam = false;

      if (trackers.find((tracker) => tracker[key])) {
        isTrackingParam = true;
      }

      return <UrlParam key={key} name={key} value={value} tracker={isTrackingParam} />;
    });
  };

  if (urlObj.searchParams.size > 0) {
    return (
      <Stack>
        <Title order={3}>{title}</Title>
        <Group align="center">{renderParams(urlObj)}</Group>
      </Stack>
    );
  }

  return <></>;
}
