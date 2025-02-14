'use client';

import { useState } from 'react';
import {
  IconEdit,
  IconExclamationCircle,
  IconWorldQuestion,
  IconWorldWww,
} from '@tabler/icons-react';
import { ActionIcon, Group, Loader, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export interface UrlInputProps {
  defaultValue?: string;
  slug?: boolean;
  readOnly?: boolean;
  clearOnSubmit?: boolean;
  placeholder?: string;
  submitButton?: React.ReactNode;
  submitTitle?: string;
  onSubmit?: (value: string) => Promise<void>;
}

export default function UrlInput({
  onSubmit,
  submitButton,
  defaultValue = '',
  slug = false,
  readOnly = false,
  clearOnSubmit = false,
  submitTitle = 'Shorten URL',
  placeholder = 'https://example.com/your/long/url',
}: UrlInputProps) {
  const [url, setUrl] = useState<string>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    let isUrl = false;
    let testUrl: URL | string = url;

    try {
      testUrl = new URL(url);
      isUrl = true;
    } catch (error) {
      if (!url.startsWith('http:') && !url.startsWith('https:')) {
        // remove the protocol if it's there
        const splitProtocol = url.split(':');

        // add back in any port numbers, or other colons in query params
        if (splitProtocol.length > 1) {
          testUrl = splitProtocol.slice(1).join(':');
        }

        // prepend an https protocol and remove relative protocol if present
        testUrl = `https://${url
          .split('/')
          .filter((part) => part)
          .join('/')}`;

        try {
          testUrl = new URL(testUrl);

          isUrl = true;
        } catch (_error) {
          isUrl = false;
        }
      }
    }

    if (!isUrl) {
      setIsLoading(false);
      notifications.show({
        title: 'Invalid URL',
        message: 'Please enter a valid URL.',
        color: 'red',
        icon: <IconExclamationCircle />,
      });

      return;
    }

    if (typeof onSubmit === 'undefined') {
      setIsLoading(false);
      return;
    }

    onSubmit?.(testUrl.toString())
      .then(() => {
        if (clearOnSubmit) {
          setUrl('');
        }
      })
      .catch((error) => {
        console.error(error);

        notifications.show({
          title: 'Could not shorten URL',
          message: 'Please try again later.',
          color: 'red',
          icon: <IconExclamationCircle />,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form id="url-shortener" onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack>
        <Group align="center" style={{ width: '100%' }}>
          <TextInput
            ref={(element) => {
              if (element) {
                element.focus();
              }
            }}
            placeholder={placeholder}
            style={{ width: '100%' }}
            size="lg"
            leftSection={slug ? <IconWorldQuestion /> : <IconWorldWww />}
            rightSection={
              isLoading ? (
                <Loader size="sm" c="violet" />
              ) : submitButton ? (
                <ActionIcon
                  color="violet"
                  title={submitTitle}
                  type="submit"
                  disabled={isLoading || readOnly}
                >
                  {submitButton}
                </ActionIcon>
              ) : !readOnly ? (
                <ActionIcon
                  color="violet"
                  title={submitTitle}
                  type="submit"
                  disabled={isLoading || readOnly}
                >
                  {slug ? <IconEdit /> : <IconWorldQuestion />}
                </ActionIcon>
              ) : (
                <></>
              )
            }
            value={url}
            disabled={isLoading || readOnly}
            onChange={handleChange}
          />
        </Group>
      </Stack>
    </form>
  );
}
