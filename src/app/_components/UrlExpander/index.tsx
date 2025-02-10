'use client';

import { redirect } from 'next/navigation';
import { IconEyePlus } from '@tabler/icons-react';
import { Center, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import UrlInput from '@/app/_components/UrlInput';

export default function UrlExpander() {
  const [visible, { toggle }] = useDisclosure(false);

  const onSubmit = async (url: string): Promise<void> => {
    toggle();

    redirect(`/is/${url}`);
  };

  return (
    <Center pos="relative" w="100%">
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'xs', blur: 2 }} />
      <UrlInput
        placeholder="https://bit.ly/short-url"
        submitButton={<IconEyePlus />}
        onSubmit={onSubmit}
        submitTitle="Expand URL"
      />
    </Center>
  );
}
