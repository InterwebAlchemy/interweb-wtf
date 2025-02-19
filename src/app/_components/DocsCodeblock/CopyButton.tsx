'use client';

import { IconAlertTriangle, IconClipboard, IconClipboardCheck } from '@tabler/icons-react';
import {
  ActionIcon,
  type ActionIconVariant,
  type MantineColor,
  type MantineSize,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

export interface CopyButtonProps {
  content?: string;
  size?: MantineSize;
  variant?: ActionIconVariant;
  color?: MantineColor;
}

export default function CopyButton({
  content = '',
  size = 'sm',
  variant = 'light',
  color = 'teal',
}: CopyButtonProps) {
  const onClick = (): void => {
    copy()
      .then(() => {
        notifications.show({
          title: 'Copied to clipboard',
          message: 'The code has been copied to your clipboard.',
          icon: <IconClipboardCheck />,
          color: 'teal',
        });
      })
      .catch(() => {
        notifications.show({
          title: 'Failed to copy to clipboard',
          message: 'Please try again.',
          icon: <IconAlertTriangle />,
          color: 'red',
        });
      });
  };

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <ActionIcon
      className="copy-btn"
      color={color}
      variant={variant}
      size={size}
      title="Copy code to clipboard"
      onClick={onClick}
    >
      <IconClipboard />
    </ActionIcon>
  );
}
