'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconAlertTriangle,
  IconCopy,
  IconCopyCheck,
  IconTagOff,
  IconWorldWww,
} from '@tabler/icons-react';
import { Anchor, Button, Center, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CipherText from '@/app/_components/CipherText';
import UrlInput from '@/app/_components/UrlInput';
import UrlParams from '@/app/_components/UrlParams';
import { removeTrackingParams } from '@/app/_utils/url';
import { KNOWN_SHORTENERS } from '@/constants';

interface UrlCleanerProps {
  demoMode?: boolean;
}

export default function UrlCleaner({ demoMode = false }: UrlCleanerProps) {
  const [isCleaned, setIsCleaned] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [cleanedUrl, setCleanedUrl] = useState('');

  const onSubmit = async (url: string): Promise<void> => {
    const urlObject = new URL(url);

    if (KNOWN_SHORTENERS.includes(urlObject.hostname)) {
      notifications.show({
        title: 'Shortlink Detected',
        message: (
          <Text>
            This URL is a shortlink. Please{' '}
            <Anchor href="/is" component={Link}>
              expand
            </Anchor>{' '}
            it instead to receive a cleaned URL.
          </Text>
        ),
        color: 'red',
        icon: <IconAlertTriangle />,
      });
    } else {
      setOriginalUrl(url);
      const cleanedUrl = removeTrackingParams(urlObject);

      setIsCleaned(true);
      setCleanedUrl(cleanedUrl.toString());
    }
  };

  const copyCleanUrl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(cleanedUrl);

      notifications.show({
        title: 'URL Copied',
        message: 'The URL has been copied to your clipboard',
        color: 'teal',
        icon: <IconCopyCheck />,
      });
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Failed to copy URL',
        message: 'Please copy the URL manually',
        color: 'red',
        icon: <IconAlertTriangle />,
      });
    }
  };

  const cleanAnotherUrl = async (): Promise<void> => {
    setOriginalUrl('');
    setCleanedUrl('');
    setIsCleaned(false);
  };

  const onTagClick = (param: { name: string; value?: string }): void => {
    const urlObject = new URL(cleanedUrl);

    if (urlObject.searchParams.has(param.name)) {
      console.log('removing', param.name);

      urlObject.searchParams.delete(param.name);
    } else {
      console.log('adding', param.name, param.value);

      urlObject.searchParams.set(param.name, param?.value || '');
    }

    setCleanedUrl(urlObject.toString());
  };

  useEffect(() => {
    if (isCleaned) {
      notifications.show({
        title: 'URL cleaned',
        message: 'The URL has been cleaned',
        color: 'teal',
        icon: <IconTagOff />,
      });
    }
  }, [isCleaned]);
  return (
    <Center pos="relative" w="100%">
      <Stack w="100%" h="100%">
        {!originalUrl && (
          <UrlInput
            placeholder="https://bit.ly/short-url"
            submitButton={<IconTagOff />}
            onSubmit={onSubmit}
            submitTitle="Clean URL"
            readOnly={originalUrl.length > 0}
          />
        )}

        {cleanedUrl &&
          (isCleaned ? (
            <Stack>
              <UrlInput
                value={cleanedUrl.toString()}
                submitButton={<IconCopy />}
                onSubmit={copyCleanUrl}
                submitTitle="Copy URL"
                submitVariant="transparent"
                submitColor="teal"
                readOnly
              />
              <Group mt={!demoMode ? 40 : 0} mb={!demoMode ? 80 : 0}>
                <Button color="teal" leftSection={<IconTagOff />} onClick={cleanAnotherUrl}>
                  Clean Another URL
                </Button>
              </Group>
              <UrlParams url={originalUrl} onClick={onTagClick} />
            </Stack>
          ) : (
            <Group
              px="xs"
              align="center"
              bd="1px solid #ccc"
              style={{ borderRadius: '3px' }}
              preventGrowOverflow
              wrap="nowrap"
            >
              <IconWorldWww color="var(--input-section-color, var(--mantine-color-dimmed))" />
              <Text span c="violet" size="18px" truncate="end" maw="90%" py="md" title={cleanedUrl}>
                {cleanedUrl ? (
                  <CipherText
                    defaultText={originalUrl}
                    targetText={cleanedUrl}
                    action="transform"
                    onFinish={() => {
                      setIsCleaned(true);
                    }}
                  />
                ) : (
                  'Cleaning URL...'
                )}
              </Text>
            </Group>
          ))}
      </Stack>
    </Center>
  );
}
