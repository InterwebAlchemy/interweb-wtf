'use client';

import { useState } from 'react';
import {
  IconAlertTriangle,
  IconClipboardCheck,
  IconClipboardCopy,
  IconSquareKey,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Code,
  Group,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/app/_adapters/supabase/client';
import { InterwebWtfApiKey } from '@/types';

export interface ApiKeyGeneratorProps {
  keys: InterwebWtfApiKey[];
}

export default function ApiKeyGenerator({ keys = [] }: ApiKeyGeneratorProps): React.ReactElement {
  const supabase = createClient();

  const [keyName, setKeyName] = useState<string>('');
  const [renderedKeys, setRenderedKeys] = useState<Array<InterwebWtfApiKey>>(keys);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [keyToDelete, setKeyToDelete] = useState<string>('');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyName(event.target.value);
  };

  const onDelete = async (): Promise<void> => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        return;
      }

      await fetch('/api/internal/user/key/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId: keyToDelete, userId: user?.id }),
      });

      setRenderedKeys((previousKeys) => {
        return previousKeys.filter((key) => key.id !== keyToDelete);
      });

      close();

      notifications.show({
        title: 'API Key Deleted',
        message: 'API key has been deleted.',
        color: 'red',
        icon: <IconTrash />,
      });
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'API Key Error',
        message: 'Could not delete API key.',
        color: 'red',
        icon: <IconAlertTriangle />,
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setIsGenerating(true);

    supabase.auth
      .getUser()
      .then(async ({ data: { user }, error }) => {
        if (error) {
          console.error(error);
          return;
        }

        try {
          // check for existing key with keyName
          const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('name', `${user?.id}::${keyName}`)
            .single();

          if (error) {
            console.error(error);
          }

          if (data) {
            notifications.show({
              title: 'API Key Exists',
              message: 'A key with this name already exists.',
              color: 'red',
              icon: <IconAlertTriangle />,
            });
          } else {
            try {
              const newKey: InterwebWtfApiKey = await fetch('/api/internal/user/key/generate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id, name: keyName }),
              })
                .then(async (res) => {
                  if (res.ok) {
                    return await res.json();
                  }
                })
                .catch((error) => {
                  console.error(error);
                });

              if (newKey) {
                setRenderedKeys((previousKeys) => {
                  const updatedKeys = [
                    ...previousKeys.map((key) => {
                      // if the user generated multiple keys, we'll need to obfuscate the previously generated keys
                      if (key.isNew) {
                        return {
                          ...key,
                          key: `${key.key.slice(0, 4)}${'*'.repeat(key.key.length - 8)}${key.key.slice(-4)}`,
                          isNew: false,
                        };
                      }

                      // older keys don't need to be obfuscated
                      return key;
                    }),
                  ];

                  updatedKeys.unshift(newKey);

                  return updatedKeys;
                });

                setKeyName('');

                notifications.show({
                  title: 'API Key Generated',
                  message: 'API key has been generated.',
                  color: 'teal',
                  icon: <IconSquareKey />,
                });
              } else {
                notifications.show({
                  title: 'API Key Error',
                  message: 'Could not generate API key.',
                  color: 'red',
                  icon: <IconAlertTriangle />,
                });
              }
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const renderKeys = (): React.ReactNode[] => {
    return renderedKeys.map(({ key, name, id, createdAt, isNew = false }) => {
      // convert createdAt to a human-readable date
      const createdAtDate = new Date(createdAt ?? '');

      const createdAtHumanReadable = createdAtDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return (
        <Table.Tr key={id}>
          <Table.Td>
            <Text lineClamp={1} truncate="end" title={name}>
              {name}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text lineClamp={1} truncate="start" title={key} ta="left">
              <Code>
                {key.slice(0, 4)}**********{key.slice(-4)}
              </Code>
            </Text>
          </Table.Td>
          <Table.Td>
            <Text lineClamp={1} truncate="end" title={createdAtDate.toLocaleString()}>
              <time dateTime={createdAtDate.toLocaleString()}>{createdAtHumanReadable}</time>
            </Text>
          </Table.Td>
          <Table.Td>
            <Group justify="end">
              {isNew && (
                <ActionIcon
                  variant="transparent"
                  title="Copy API Key"
                  onClick={() => {
                    navigator.clipboard.writeText(key);

                    notifications.show({
                      title: 'API Key Copied',
                      message:
                        'You can now paste it somewhere safe. You will only see this key once.',
                      color: 'teal',
                      icon: <IconClipboardCheck />,
                    });
                  }}
                >
                  <IconClipboardCopy />
                </ActionIcon>
              )}
              <ActionIcon
                variant="transparent"
                color="red"
                title="Delete API Key"
                onClick={() => {
                  setKeyToDelete(id);
                  open();
                }}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Table.Td>
        </Table.Tr>
      );
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete API Key">
        <Text>Are you sure you want to delete this API key?</Text>
        <Group>
          <Button leftSection={<IconTrash />} color="red" onClick={onDelete}>
            Delete
          </Button>
          <Button onClick={close}>Cancel</Button>
        </Group>
      </Modal>
      <Stack w="100%" h="100%">
        <form onSubmit={onSubmit}>
          <Group w="100%">
            <TextInput
              disabled={isGenerating}
              placeholder="API Key Name"
              value={keyName}
              onChange={onChange}
              rightSection={isGenerating ? <Loader size="sm" /> : <></>}
            />
            <ActionIcon
              type="submit"
              color="violet"
              title="Generate API Key"
              disabled={!keyName || isGenerating}
            >
              <IconSquareKey />
            </ActionIcon>
          </Group>
        </form>
        {renderedKeys.length > 0 && (
          <Group h="100%" w="100%">
            <Title order={3}>API Keys</Title>
            <Table striped layout="fixed">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderKeys()}</Table.Tbody>
            </Table>
          </Group>
        )}
      </Stack>
    </>
  );
}
