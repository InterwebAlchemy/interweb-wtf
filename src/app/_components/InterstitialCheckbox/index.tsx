'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { IconWorldQuestion, IconWorldWww } from '@tabler/icons-react';
import { Switch, Tooltip } from '@mantine/core';

export default function InterstitialCheckbox() {
  const [skipInspector, setSkipInspector] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked;

    // set the cookie
    document.cookie = `skip_info_interstitial=${value}; path=/; max-age=31536000`;

    setSkipInspector(value);
  };

  useEffect(() => {
    // get the cookie value
    const cookieValue =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('skip_info_interstitial'))
        ?.split('=')[1] === 'true';

    setSkipInspector(cookieValue);
  }, []);

  return (
    <Tooltip
      label="Enabling this will skip the WTF Link Inspector and redirect you
          directly to the cleaned destination URL when navigating to a WTF Link."
      refProp="rootRef"
    >
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
            <IconWorldWww size="sm" color="var(--mantine-color-red-text)" />
          ) : (
            <IconWorldQuestion size="sm" color="var(--mantine-color-violet-filled)" />
          )
        }
      />
    </Tooltip>
  );
}
