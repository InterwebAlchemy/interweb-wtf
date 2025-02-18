import { redirect, RedirectType } from 'next/navigation';
import { Group } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/server';
import DangerZoneTab from '@/app/_components/DangerZoneTab';
import Screen from '@/app/_components/Screen';
import SettingsNav from '@/app/_components/SettingsNav';

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
      <Group w="100%" h="100%">
        <SettingsNav activeTab="danger" />
        <DangerZoneTab />
      </Group>
    </Screen>
  );
}
