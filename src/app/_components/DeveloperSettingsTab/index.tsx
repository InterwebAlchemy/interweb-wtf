import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { Anchor, Box, Stack, Text } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import ApiKeyGenerator from '@/app/_components/ApiKeyGenerator';
import { InterwebWtfApiKey } from '@/types';

export default async function DeveloperSettingsTab() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error(userError);
    redirect('/login', RedirectType.replace);
  }

  const apiUrl = new URL('/api/internal/user/keys', process.env.NEXT_PUBLIC_APPLICATION_URL);

  let keys: InterwebWtfApiKey[] = [];

  try {
    keys = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user?.id }),
    })
      .then(async (res) => {
        if (res.ok) {
          return await res.json();
        }

        console.error(res.status, res.statusText);
      })
      .catch((error) => {
        console.error(error);
      })
      .then(({ keys }) => {
        return keys;
      });
  } catch (error) {
    console.error(error);
  }

  return (
    <Box px="md" w={{ base: '100%', md: '80%' }}>
      <Stack h="100%" w="100%">
        <Text>
          Manage your{' '}
          <Anchor component={Link} href="/docs">
            API
          </Anchor>{' '}
          keys.
        </Text>
        <ApiKeyGenerator keys={keys} />
      </Stack>
    </Box>
  );
}
