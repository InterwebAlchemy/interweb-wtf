import { redirect, RedirectType } from 'next/navigation';
import { Group } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import GeneralSettingsTab from '@/app/_components/GeneralSettingsTab';
import Screen from '@/app/_components/Screen';
import SettingsNav from '@/app/_components/SettingsNav';

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
};

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

  return (
    <Screen title="Settings" authenticated>
      <Group w="100%" h="100%">
        <SettingsNav activeTab="general" />
        <GeneralSettingsTab />
      </Group>
    </Screen>
  );
}
