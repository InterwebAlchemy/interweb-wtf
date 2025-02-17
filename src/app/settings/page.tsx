import { redirect, RedirectType } from 'next/navigation';
import { Box, Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import DangerZoneTab from '@/app/_components/DangerZoneTab';
import DeveloperSettingsTab from '@/app/_components/DeveloperSettingsTab';
import GeneralSettingsTab from '@/app/_components/GeneralSettingsTab';
import Screen from '@/app/_components/Screen';
import { createClient } from '../_adapters/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error(userError);
    redirect('/login', RedirectType.replace);
  }

  const apiUrl = new URL('/api/user/keys', process.env.NEXT_PUBLIC_APPLICATION_URL);

  const { keys } = await fetch(apiUrl, {
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
    });

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
            <DeveloperSettingsTab keys={keys} />
          </TabsPanel>
          <TabsPanel value="danger">
            <DangerZoneTab />
          </TabsPanel>
        </Tabs>
      </Box>
    </Screen>
  );
}
