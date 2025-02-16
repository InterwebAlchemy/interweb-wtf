import { Box, Stack, Text, Title } from '@mantine/core';

export default function GeneralSettingsTab() {
  return (
    <Box p="md">
      <Stack h="100%" w="100%">
        <Title order={2}>General Settings</Title>
        <Text>This is where you can adjust your general settings.</Text>
      </Stack>
    </Box>
  );
}
