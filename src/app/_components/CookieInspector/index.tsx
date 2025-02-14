'use client';

import { useIsClient } from 'usehooks-ts';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';

export default function CookieInspector() {
  const isClient = useIsClient();

  if (!isClient) {
    return <></>;
  }

  // get cookies for current domain
  const cookies = document.cookie.split(';').filter((cookie) => cookie);

  const renderCookies = () => {
    return cookies.map((cookie) => {
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
    });
  };

  if (cookies.length === 0) {
    return <></>;
  }

  return (
    <Stack w="100%">
      <Title order={4}>Active {process.env.NEXT_PUBLIC_APPLICATION_URL} Cookies</Title>
      <Text>Here are the cookies currently associated with this website in your browser.</Text>
      <Group>{renderCookies()}</Group>
    </Stack>
  );
}
