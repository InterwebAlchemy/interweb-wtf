'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink, Stack } from '@mantine/core';

export interface SettingsNavProps {
  activeTab?: string;
}

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
  children?: NavItem[];
  defaultOpened?: boolean;
}

export default function DocsNav({ activeTab }: SettingsNavProps) {
  const pathname = usePathname();

  const navChildOffset = 5;

  const navItems: NavItem[] = [
    {
      href: '/docs',
      label: 'Overview',
    },
    {
      href: '/docs/shorten',
      label: 'Shorten URLs',
    },
    {
      href: '/docs/clean',
      label: 'Clean URLs',
    },
    {
      href: '/docs/expand',
      label: 'Expand Shorlinks',
    },
    {
      href: '/docs/interfaces',
      label: 'Interfaces',
      defaultOpened: true,
      children: [
        {
          href: '/docs/interfaces/web',
          label: 'Web Interface',
        },
        {
          href: '/docs/interfaces/url',
          label: 'URL Interface',
        },
        {
          href: '/docs/interfaces/api',
          label: 'API Interface',
        },
      ],
    },
    {
      href: '/docs/concepts',
      label: 'Concepts',
      defaultOpened: pathname.includes('/docs/concepts'),
      children: [
        {
          href: '/docs/concepts/wtf-links',
          label: 'WTF Links',
        },
        {
          href: '/docs/concepts/tracking',
          label: 'Tracking',
        },
        {
          href: '/docs/concepts/shortlinks',
          label: 'Shortlinks',
        },
      ],
    },
    {
      href: '/docs/cli',
      label: 'Interweb.WTF CLI API',
      defaultOpened: pathname.includes('/docs/cli'),
      children: [
        {
          href: '/docs/cli/v0',
          label: 'CLI API v0',
          defaultOpened: pathname.includes('/docs/cli/v0'),
          children: [
            {
              href: '/docs/cli/v0/go',
              label: 'WTF Link Resolver',
            },
            {
              href: '/docs/cli/v0/is',
              label: 'Shortlink Expander',
            },
            {
              href: '/docs/cli/v0/clean',
              label: 'URL Cleaner',
            },
          ],
        },
      ],
    },
  ];

  const renderNavItems = (items: NavItem[], layer: number = 1) => {
    return items.map((item) => {
      return (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          component={Link}
          active={activeTab ? activeTab === item.href : pathname === item.href}
          childrenOffset={navChildOffset * layer}
          defaultOpened={item.defaultOpened ?? false}
        >
          {item.children && item.children.length > 0 && renderNavItems(item.children, layer + 1)}
        </NavLink>
      );
    });
  };

  return <Stack h="100%">{renderNavItems(navItems)}</Stack>;
}
