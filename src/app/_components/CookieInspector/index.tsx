'use client';

import { useIsClient } from 'usehooks-ts';
import { Badge, Code, Group, Stack, Text, Title } from '@mantine/core';

export default function CookieInspector() {
  const isClient = useIsClient();

  if (!isClient) {
    return <></>;
  }

  // get cookies for current domain
  // make sure `skip_info_interstitial` is first and then sort the rest alphabetically
  const cookies = document.cookie
    .split(';')
    .filter((cookie) => cookie)
    .sort((a, b) => {
      if (a.includes('skip_info_interstitial')) {
        return -1;
      }

      if (b.includes('skip_info_interstitial')) {
        return 1;
      }

      return 0;
    });

  const renderCookies = () => {
    if (cookies.length === 0) {
      return (
        <Text>
          <Code>
            No cookies found for {new URL(process.env.NEXT_PUBLIC_APPLICATION_URL!).hostname}
          </Code>
        </Text>
      );
    }

    return (
      <>
        {cookies.map((cookie) => {
          const [name, value] = cookie.split('=');

          return (
            <Badge
              key={name}
              variant="light"
              color="gray"
              leftSection={
                <Text span inherit fw={700}>
                  {name}:
                </Text>
              }
              radius="sm"
            >
              <Text span inherit fw={300} tt="initial">
                {value}
              </Text>
            </Badge>
          );
        })}
        <Text size="xs">
          <Text span inherit fw={700}>
            Note:
          </Text>{' '}
          Any cookies that start with <Code>SB-</Code> are from Supabase and are used for
          authentication and authorization.
        </Text>
      </>
    );
  };

  return (
    <Stack w="100%">
      <Title order={4}>Active {process.env.NEXT_PUBLIC_APPLICATION_URL} Cookies</Title>
      <Text>Here are the cookies currently associated with this website in your browser.</Text>
      <Group>{renderCookies()}</Group>
    </Stack>
  );
}
