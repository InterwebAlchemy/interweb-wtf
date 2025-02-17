import Link from 'next/link';
import { Anchor, Box, Stack, Text, Title } from '@mantine/core';
import ApiKeyGenerator from '@/app/_components/ApiKeyGenerator';
import { InterwebWtfApiKey } from '@/types';

export interface DeveloperSettingsTabProps {
  keys: InterwebWtfApiKey[];
}

export default function DeveloperSettingsTab({ keys = [] }: DeveloperSettingsTabProps) {
  return (
    <Box p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>Developer Settings</Title>
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
