'use client';

import { Group, Stack, Title } from '@mantine/core';
import { getTrackingParams } from '@/app/_utils/url';
import UrlParam, { type UrlParamProps } from './UrlParam';

export interface UrlParamsProps {
  url: string | URL;
  title?: string;
  onClick?: (param: { name: string; value?: string }) => void;
}

export default function UrlParams({
  url,
  title = 'URL Parameters',
  onClick,
}: UrlParamsProps): React.ReactElement {
  const urlObj = new URL(url.toString());

  const { knownTrackers, potentialTrackers } = getTrackingParams(urlObj);

  const renderParams = (url: URL): React.ReactNode => {
    return [...url.searchParams.entries()].map(([key, value]) => {
      let isTrackingParam;

      // Check if this is a known or potential tracking parameter
      if (knownTrackers.includes(key)) {
        isTrackingParam = 'known';
      }

      if (potentialTrackers.includes(key)) {
        isTrackingParam = 'potential';
      }

      return (
        <UrlParam
          key={key}
          name={key}
          value={value}
          tracker={isTrackingParam as UrlParamProps['tracker']}
          onClick={onClick}
        />
      );
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
