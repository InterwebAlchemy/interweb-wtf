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
import { ActionIcon, Anchor, Center, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CipherText from '@/app/_components/CipherText';
import UrlInput from '@/app/_components/UrlInput';
import { removeTrackingParams } from '@/app/_utils/url';
import { KNOWN_SHORTENERS } from '@/constants';

export default function UrlCleaner() {
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

  const copyCleanUrl = () => {
    navigator.clipboard.writeText(cleanedUrl);

    notifications.show({
      title: 'URL Copied',
      message: 'The URL has been copied to your clipboard',
      color: 'teal',
      icon: <IconCopyCheck />,
    });
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

        {cleanedUrl && (
          <Group px="xs" align="center" bd="1px solid #ccc" style={{ borderRadius: '3px' }}>
            <IconWorldWww color="var(--input-section-color, var(--mantine-color-dimmed))" />
            <Text span c="violet" size="18px" truncate="end" maw="90%" py="md" title={cleanedUrl}>
              {cleanedUrl ? (
                <CipherText
                  defaultText={originalUrl}
                  targetText={cleanedUrl}
                  action="transform"
                  speed={30}
                  maxIterations={12}
                  onFinish={() => {
                    setIsCleaned(true);
                  }}
                />
              ) : (
                'Cleaning URL...'
              )}
            </Text>
            <ActionIcon
              variant="transparent"
              color="teal"
              size="sm"
              onClick={copyCleanUrl}
              ml="auto"
            >
              <IconCopy />
            </ActionIcon>
          </Group>
        )}
      </Stack>
    </Center>
  );
}
