'use client';

import { useState } from 'react';
import {
  IconAlertTriangle,
  IconClipboardCheck,
  IconClipboardCopy,
  IconSquareKey,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Code,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyName(event.target.value);
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
              const { keyId } = await fetch('/api/user/key/generate', {
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

              if (keyId) {
                try {
                  const { key } = await fetch('/api/user/key/get', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user?.id, keyId }),
                  })
                    .then(async (res) => {
                      if (res.ok) {
                        return await res.json();
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    });

                  setRenderedKeys((previousKeys) => {
                    const newKeys = [
                      ...previousKeys.map((key) => {
                        if (key.isNew) {
                          return {
                            ...key,
                            key: `${key.key.slice(0, 4)}${'*'.repeat(key.key.length - 8)}${key.key.slice(-4)}`,
                            isNew: false,
                          };
                        }
                        return { ...key };
                      }),
                    ];

                    newKeys.unshift({ ...key, isNew: true });
                    return newKeys;
                  });

                  setKeyName('');

                  notifications.show({
                    title: 'API Key Generated',
                    message: 'API key has been generated.',
                    color: 'teal',
                    icon: <IconSquareKey />,
                  });
                } catch (error) {
                  console.error(error);
                }
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
    return renderedKeys.map(({ key, name, isNew = false }) => {
      return (
        <Table.Tr key={name}>
          <Table.Td>
            <Text lineClamp={1} truncate="end">
              {name}
            </Text>
          </Table.Td>
          <Table.Td>
            <Code>{key}</Code>
          </Table.Td>
          <Table.Td>
            {isNew && (
              <ActionIcon
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
          </Table.Td>
        </Table.Tr>
      );
    });
  };

  return (
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
              <Table.Tr w="30%">
                <Table.Th>
                  <Text>Name</Text>
                </Table.Th>
                <Table.Th w="60%">
                  <Text>Key</Text>
                </Table.Th>
                <Table.Th w="10%" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderKeys()}</Table.Tbody>
          </Table>
        </Group>
      )}
    </Stack>
  );
}
