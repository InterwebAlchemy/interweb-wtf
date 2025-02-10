'use client';

import { Group, Text } from '@mantine/core';
import UrlInput from '@/app/_components/UrlInput';

export interface ShortLinkInputProps {
  slug: string;
  linkId: string;
}

export default function ShortLinkInput({ slug, linkId }: ShortLinkInputProps) {
  const onEdit = async (slug: string): Promise<void> => {
    await fetch('/api/slug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug, id: linkId }),
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      }
    });
  };

  return (
    <Group>
      <Text fw="bold">interweb.wtf/go/</Text>
      <UrlInput defaultValue={slug} onSubmit={onEdit} slug readOnly />
    </Group>
  );
}
