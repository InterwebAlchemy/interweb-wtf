import Link from 'next/link';
import { NavLink, Stack } from '@mantine/core';

export interface SettingsNavProps {
  activeTab: string;
}

export default function SettingsNav({ activeTab }: SettingsNavProps) {
  return (
    <Stack h="100%">
      <NavLink href="/settings" label="General" component={Link} active={activeTab === 'general'} />
      <NavLink
        href="/settings/developer"
        label="Developer"
        component={Link}
        active={activeTab === 'developer'}
      />
      <NavLink
        href="/settings/danger"
        label="Danger Zone"
        component={Link}
        active={activeTab === 'danger'}
      />
    </Stack>
  );
}
