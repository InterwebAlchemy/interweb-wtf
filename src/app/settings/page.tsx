import { Box, Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import DangerZoneTab from '@/app/_components/DangerZoneTab';
import DeveloperSettingsTab from '@/app/_components/DeveloperSettingsTab';
import GeneralSettingsTab from '@/app/_components/GeneralSettingsTab';
import Screen from '@/app/_components/Screen';

export default function SettingsPage() {
  return (
    <Screen title="Settings" authenticated>
      <Box w="100%" h="100%">
        <Tabs defaultValue="general" orientation="vertical" h="100%">
          <TabsList>
            <TabsTab value="general">General</TabsTab>
            <TabsTab value="security">Developer</TabsTab>
            <TabsTab value="danger">Danger Zone</TabsTab>
          </TabsList>
          <TabsPanel value="general">
            <GeneralSettingsTab />
          </TabsPanel>
          <TabsPanel value="security">
            <DeveloperSettingsTab />
          </TabsPanel>
          <TabsPanel value="danger">
            <DangerZoneTab />
          </TabsPanel>
        </Tabs>
      </Box>
    </Screen>
  );
}
