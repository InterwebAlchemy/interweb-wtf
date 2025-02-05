'use client';

import { useState } from 'react';
import { IconEdit, IconWorldQuestion, IconWorldWww } from '@tabler/icons-react';
import { ActionIcon, Group, Loader, TextInput } from '@mantine/core';

export interface UrlInputProps {
  defaultValue?: string;
  slug?: boolean;
  readOnly?: boolean;
  clearOnSubmit?: boolean;
  onSubmit?: (value: string) => Promise<void>;
}

export default function UrlInput({
  onSubmit,
  defaultValue = '',
  slug = false,
  readOnly = false,
  clearOnSubmit = false,
}: UrlInputProps) {
  const [url, setUrl] = useState<string>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

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
    <form id="url-shortener" onSubmit={handleSubmit}>
      <Group align="center" style={{ width: '100%' }}>
        <TextInput
          ref={(element) => {
            if (element) {
              element.focus();
            }
          }}
          placeholder="https://example.com/your/long/url"
          style={{ width: '100%' }}
          leftSection={slug ? <IconWorldQuestion /> : <IconWorldWww />}
          rightSection={
            !readOnly ? (
              <ActionIcon color="violet" title="Shorten URL" type="submit" disabled={isLoading}>
                {isLoading ? <Loader /> : slug ? <IconEdit /> : <IconWorldQuestion />}
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
    </form>
  );
}
