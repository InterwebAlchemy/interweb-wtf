'use client';

import { useEffect, useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, Badge, Code, Group, Loader, Stack, Text } from '@mantine/core';

export interface UrlMetadataProps {
  url: URL | string;
}

export default function UrlMetadata({ url }: UrlMetadataProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number>();
  const [fullUrl, setFullUrl] = useState<string>();
  const [redirected, setRedirected] = useState<boolean>();
  const [contentType, setContentType] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.toString() }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        setErrorMessage(response.statusText);
      })
      .then(({ status, contentType: resolvedContentType, url: resolvedUrl, redirected }) => {
        setStatus(status);
        setFullUrl(resolvedUrl);
        setRedirected(redirected);
        setContentType(resolvedContentType);

        console.log(resolvedUrl, url);
      })
      .catch(() => {
        setErrorMessage('Could not resolve URL.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const renderStatus = () => {
    if (status) {
      return (
        <Badge
          color="white"
          bg={status >= 200 && status < 400 ? (status < 300 ? 'green' : 'orange') : 'red'}
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
      );
    }
  };

  const renderContentType = (): React.ReactNode => {
    if (contentType) {
      return (
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
      );
    }

    return <></>;
  };

  const renderMetadata = () => {
    return (
      <Stack w="100%">
        <Group align="center" w="100%">
          {renderStatus()}
          {renderContentType()}
        </Group>
        {fullUrl?.toString() !== url.toString() && (
          <Alert
            variant="outline"
            color="red"
            title="Redirect Warning"
            icon={<IconAlertTriangle />}
          >
            The URL was resolved to <Code>{fullUrl}</Code> instead of <Code>{url.toString()}</Code>.
          </Alert>
        )}
        {redirected && (
          <Alert
            variant="outline"
            color="red"
            title="Redirect Warning"
            icon={<IconAlertTriangle />}
          >
            The URL was redirected while resolving <Code>{url.toString()}</Code>.
          </Alert>
        )}
      </Stack>
    );
  };

  return (
    <Group align="center" justify="center" w="100%">
      {isLoading ? <Loader /> : errorMessage ? <Text>{errorMessage}</Text> : renderMetadata()}
    </Group>
  );
}
