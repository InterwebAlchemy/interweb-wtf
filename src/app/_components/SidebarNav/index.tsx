'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Burger,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  NavLink,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { NavItem } from '@/types';

export interface SidebarNavProps {
  activeTab?: string;
  links: NavItem[];
}

export default function SidebarNav({ activeTab, links }: SidebarNavProps) {
  const pathname = usePathname();

  const navChildOffset = 5;

  const [opened, { toggle }] = useDisclosure(false);

  const renderMenuLinks = (items: NavItem[]): React.ReactNode[] => {
    return items.map((link) => {
      if (link.children) {
        return (
          <Fragment key={link.id}>
            <MenuLabel>{link.label}</MenuLabel>
            {renderMenuLinks(link.children)}
          </Fragment>
        );
      }

      return (
        <MenuItem
          key={link.id ?? link.href}
          leftSection={link.icon}
          component={Link}
          href={link.href}
          disabled={activeTab === link.id}
          onClick={toggle}
        >
          {link.label}
        </MenuItem>
      );
    });
  };

  const renderNavItems = (items: NavItem[], layer: number = 1) => {
    return items.map((item) => {
      return (
        <NavLink
          key={item.id ?? item.href}
          href={item.href}
          label={item.label}
          component={Link}
          active={activeTab ? activeTab === item.id : pathname === item.href}
          childrenOffset={navChildOffset * layer}
          defaultOpened={pathname.includes(item.href)}
        >
          {item.children && item.children.length > 0 && renderNavItems(item.children, layer + 1)}
        </NavLink>
      );
    });
  };

  return (
    <>
      <Box hiddenFrom="md" w="100%" pos="relative" ta="right" mb={10}>
        <Menu opened={opened}>
          <MenuTarget>
            <Burger opened={opened} onClick={toggle} />
          </MenuTarget>
          <MenuDropdown>{renderMenuLinks(links)}</MenuDropdown>
        </Menu>
      </Box>
      <Box visibleFrom="md" w={{ base: '100%', md: '20%' }}>
        <Stack h="100%" gap={0} align="flex-start">
          {renderNavItems(links)}
        </Stack>
      </Box>
    </>
  );
}
