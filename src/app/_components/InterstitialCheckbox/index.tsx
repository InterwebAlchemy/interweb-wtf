'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Switch } from '@mantine/core';

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
    const cookieValue = Boolean(
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('skip_info_interstitial'))
        ?.split('=')[1]
    );

    setSkipInspector(cookieValue);
  }, []);

  return (
    <Switch
      label="Skip the Inspector Interstitial"
      labelPosition="left"
      color="violet"
      radius="xs"
      onChange={onChange}
      checked={skipInspector}
    />
  );
}
