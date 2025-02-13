'use client';

import { useState } from 'react';
import {
  IconEdit,
  IconExclamationCircle,
  IconWorldQuestion,
  IconWorldWww,
} from '@tabler/icons-react';
import { ActionIcon, Group, Loader, Stack, Text, TextInput } from '@mantine/core';

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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    let isUrl = false;

    try {
      const testUrl = new URL(url);

      if (testUrl.protocol === 'http:' || testUrl.protocol === 'https:') {
        isUrl = true;
      } else {
        isUrl = false;
      }
    } catch (error) {
      isUrl = false;
    }

    if (!isUrl) {
      setIsLoading(false);
      setErrorMessage('Please enter a valid URL.');
      return;
    }

    if (typeof onSubmit === 'undefined') {
      setIsLoading(false);
      return;
    }

    onSubmit?.(url)
      .then(() => {
        if (clearOnSubmit) {
          setUrl('');
        }
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
                <Loader size="sm" />
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
        {errorMessage !== '' ? (
          <Group>
            <IconExclamationCircle color="red" />
            <Text c="red">{errorMessage}</Text>
          </Group>
        ) : (
          <></>
        )}
      </Stack>
    </form>
  );
}
