'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { IconInfoCircle, IconWorldQuestion, IconWorldWww } from '@tabler/icons-react';
import {
  ActionIcon,
  Code,
  createTheme,
  Group,
  MantineProvider,
  Popover,
  Switch,
  Text,
} from '@mantine/core';

export default function InterstitialCheckbox() {
  const [skipInspector, setSkipInspector] = useState(true);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked;

    // set the cookie
    document.cookie = `skip_info_interstitial=${value}; path=/; max-age=31536000`;

    setSkipInspector(value);
  };

  const theme = createTheme({
    cursorType: 'pointer',
  });

  useEffect(() => {
    // get the cookie value
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('skip_info_interstitial'))
      ?.split('=')[1];

    if (typeof cookieValue !== 'undefined' && cookieValue === 'false') {
      setSkipInspector(false);
    }
  }, []);

  return (
    <Group justify="center" align="center">
      <MantineProvider theme={theme}>
        <Switch
          label="Skip the Inspector"
          labelPosition="left"
          color="violet"
          radius="sm"
          size="md"
          onChange={onChange}
          checked={skipInspector}
          thumbIcon={
            skipInspector ? (
              <IconWorldWww size={16} color="var(--mantine-color-red-text)" />
            ) : (
              <IconWorldQuestion size={16} color="var(--mantine-color-violet-filled)" />
            )
          }
        />
      </MantineProvider>
      <Popover width={200} position="top" withArrow>
        <Popover.Target>
          <ActionIcon c="cyan" size="sm" bg="transparent">
            <IconInfoCircle />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">
            Disabling this will always redirect you to the WTF Link Inspector (avaialable by
            appending <Code>/info</Code> to any WTF Link) instead of redirecting you to the URL that
            a WTF Link is pointing to.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
