import { redirect, RedirectType } from 'next/navigation';
import { Group } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import DeveloperSettingsTab from '@/app/_components/DeveloperSettingsTab';
import Screen from '@/app/_components/Screen';
import SidebarNav from '@/app/_components/SidebarNav';
import { SETTINGS_NAV_ITEMS } from '@/constants';

export const metadata = {
  title: 'Developer Settings',
  description: 'Manage your API keys and other developer settings',
};

export default async function DeveloperSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error(userError);
    redirect('/login', RedirectType.replace);
  }

  return (
    <Screen title="Developer Settings">
      <Group w="100%" h="100%" gap={0} align="flex-start">
        <SidebarNav activeTab="developer" links={SETTINGS_NAV_ITEMS} />
        <DeveloperSettingsTab />
      </Group>
    </Screen>
  );
}
