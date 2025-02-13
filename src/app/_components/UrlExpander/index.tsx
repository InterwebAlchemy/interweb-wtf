'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { IconEyePlus } from '@tabler/icons-react';
import { useTimeout } from 'usehooks-ts';
import { Center, Stack, Text } from '@mantine/core';
import CipherText from '@/app/_components/CipherText';
import UrlInput from '@/app/_components/UrlInput';

export default function UrlExpander() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [resolvedUrl, setResolvedUrl] = useState('');

  const onSubmit = async (url: string): Promise<void> => {
    setShortUrl(url);

    const { url: fullUrl } = await fetch(`/api/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      }
    });

    setResolvedUrl(fullUrl);
  };

  useTimeout(
    () => {
      if (shouldRedirect) {
        redirect(`/is/${shortUrl}`);
      }
    },
    shouldRedirect ? 500 : null
  );

  return (
    <Center pos="relative" w="100%">
      <Stack w="100%" h="100%">
        <UrlInput
          placeholder="https://bit.ly/short-url"
          submitButton={<IconEyePlus />}
          onSubmit={onSubmit}
          submitTitle="Expand URL"
          readOnly={shortUrl.length > 0}
        />

        {shortUrl && (
          <Text c="violet" size="md" w="100%" fw={700}>
            {resolvedUrl ? (
              <CipherText
                defaultText={shortUrl}
                targetText={resolvedUrl}
                action="transform"
                onFinish={() => {
                  setShouldRedirect(true);
                }}
              />
            ) : (
              'Expanding URL...'
            )}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
