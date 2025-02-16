'use client';

import { IconAlertTriangle, IconFileShredder } from '@tabler/icons-react';
import { Alert, Box, Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from '@/app/_adapters/supabase/client';

export default function DangerZoneTab() {
  const [opened, { open, close }] = useDisclosure(false);

  const deleteUserProfile = (): void => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (!user || error) {
        return;
      }

      try {
        await fetch('/api/user/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Are you sure?">
        <Text>
          <Text span inherit fw={700}>
            This action is irreversible.
          </Text>{' '}
          Your account and all of your WTF Links will be deleted permanently.
        </Text>
        <Text mt={20}>Are you sure you want to delete your account?</Text>
        <Group mt={40} justify="end">
          <Button
            onClick={deleteUserProfile}
            color="red"
            variant="filled"
            leftSection={<IconFileShredder />}
          >
            Delete
          </Button>
          <Button onClick={close} variant="outline">
            Cancel
          </Button>
        </Group>
      </Modal>
      <Box p="md">
        <Stack h="100%" w="100%">
          <Title order={2}>Danger Zone</Title>
          <Alert color="red" title="Delete Account" icon={<IconAlertTriangle />}>
            <Text>Deleting your account will permanently delete all of your saved WTF Links.</Text>
            <Group mt={20}>
              <Button
                onClick={open}
                color="red"
                variant="filled"
                leftSection={<IconFileShredder />}
              >
                Delete Account
              </Button>
            </Group>
          </Alert>
        </Stack>
      </Box>
    </>
  );
}
