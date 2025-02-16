import { Box, Stack, Text, Title } from '@mantine/core';

export default function DeveloperSettingsTab() {
  return (
    <Box p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>Developer Settings</Title>
        <Text>This is where you can adjust your developer settings.</Text>
      </Stack>
    </Box>
  );
}
