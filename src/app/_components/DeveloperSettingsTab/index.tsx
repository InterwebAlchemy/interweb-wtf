import { Box, Stack, Title } from '@mantine/core';
import { InterwebWtfApiKey } from '@/types';
import ApiKeyGenerator from '../ApiKeyGenerator';

export interface DeveloperSettingsTabProps {
  keys: InterwebWtfApiKey[];
}

export default function DeveloperSettingsTab({ keys = [] }: DeveloperSettingsTabProps) {
  return (
    <Box p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>Developer Settings</Title>
        <ApiKeyGenerator keys={keys} />
      </Stack>
    </Box>
  );
}
