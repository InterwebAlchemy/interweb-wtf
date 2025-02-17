'use client';

import { useState } from 'react';
import { IconClipboard, IconClipboardCheck, IconWorldWww } from '@tabler/icons-react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CipherText from '@/app/_components/CipherText';

export interface CleanedUrlProps {
  cleanedUrl: string | URL;
  originalUrl: string | URL;
}

export default function CleanedUrl({ cleanedUrl, originalUrl }: CleanedUrlProps) {
  const [isCleaned, setIsCleaned] = useState(false);

  const copyCleanUrl = () => {
    navigator.clipboard.writeText(cleanedUrl.toString());

    notifications.show({
      title: 'URL Copied',
      message: 'The URL has been copied to your clipboard',
      color: 'teal',
      icon: <IconClipboardCheck />,
    });
  };

  return (
    <Group px="xs" w="100%" align="center" bd="1px solid #ccc" style={{ borderRadius: '3px' }}>
      <IconWorldWww color="var(--input-section-color, var(--mantine-color-dimmed))" />
      <Text
        span
        c="violet"
        size="18px"
        truncate="end"
        maw="90%"
        py="md"
        title={cleanedUrl.toString()}
      >
        {cleanedUrl ? (
          <CipherText
            defaultText={originalUrl.toString()}
            targetText={cleanedUrl.toString()}
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
      {isCleaned && (
        <ActionIcon variant="transparent" color="teal" size="sm" onClick={copyCleanUrl} ml="auto">
          <IconClipboard />
        </ActionIcon>
      )}
    </Group>
  );
}
