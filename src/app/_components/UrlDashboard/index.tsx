'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconClipboardCheck, IconExternalLink, IconLinkPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Box,
  Center,
  Code,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/app/_adapters/supabase/client';
import UrlInput from '@/app/_components/UrlInput';
import { KNOWN_SHORTENERS } from '@/constants';
import { Tables } from '@/types/supabase';

export interface UrlDashboardProps {
  urls: Array<Tables<'short_urls'>>;
}

export default function UrlDashboard({ urls }: UrlDashboardProps) {
  const router = useRouter();

  const [redirectSlug, setRedirectSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (url: string): Promise<void> => {
    let actualUrl = url;

    if (KNOWN_SHORTENERS.includes(new URL(url).hostname)) {
      try {
        actualUrl = await fetch('/api/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })
          .then(async (res) => {
            if (res.ok) {
              return await res.json();
            }

            setErrorMessage('Could not expand URL.');
          })
          .then(async (response) => {
            const { url: resolvedUrl } = response;

            return resolvedUrl;
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage('Could not expand URL.');
          });
      } catch (error) {
        console.error(error);
        setErrorMessage('Could not expand URL.');
      }
    }

    try {
      const slug = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: actualUrl, userAgent: navigator.userAgent }),
      })
        .then(async (res) => {
          if (res.ok) {
            return await res.json();
          }

          setErrorMessage('Could not create WTF Link.');
        })
        .then(async (response) => {
          const { slug, id } = response;

          try {
            await fetch('/api/internal/summarize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url, url_id: id }),
            })
              .then(async (res) => {
                if (res.ok) {
                  return await res.json();
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } catch (error) {
            console.error(error);
          }

          return slug;
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage('Could not create WTF Link.');
        });

      if (slug) {
        setRedirectSlug(slug);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not create WTF Link.');
    }
  };

  const onDelete = async (id: number): Promise<void> => {
    const supabase = createClient();

    try {
      const { error } = await supabase.from('short_urls').update({ deleted: true }).eq('id', id);

      if (error) {
        console.error(error);
        setErrorMessage('Could not delete WTF Link.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not delete WTF Link.');
    }
  };

  const renderRows = () => {
    return urls.map((url) => {
      const wtfLinkPath = `/go/${url.slug}/`;
      const wtfInfoLinkPath = `/go/${url.slug}/info`;
      const wtfLink = new URL(wtfLinkPath, process.env.NEXT_PUBLIC_APPLICATION_URL);
      const wtfInfoLink = new URL(wtfInfoLinkPath, process.env.NEXT_PUBLIC_APPLICATION_URL);

      return (
        <Table.Tr key={url.id}>
          <Table.Td>
            <Link href={wtfInfoLink}>{url.slug}</Link>
          </Table.Td>
          <Table.Td>
            <Text span truncate="end" lineClamp={1} title={url.url}>
              <Anchor href={url.url} target="_blank" rel="noopener noreferrer">
                {url.url}
              </Anchor>
            </Text>
          </Table.Td>
          <Table.Td>
            <Group justify="end">
              <Tooltip label="Copy WTF Link">
                <ActionIcon
                  c="violet"
                  bg="transparent"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(wtfLink.toString())
                      .then(() => {
                        notifications.show({
                          title: 'Copied WTF Link',
                          message: (
                            <Stack>
                              <Text>
                                <Code>{wtfLink.toString()}</Code> copied to clipboard.
                              </Text>
                            </Stack>
                          ),
                          color: 'violet',
                          icon: <IconClipboardCheck />,
                        });
                      })
                      .catch((error) => {
                        console.error(error);
                        setErrorMessage('Could not copy WTF Link.');
                      });
                  }}
                >
                  <IconLinkPlus />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Visit URL">
                <ActionIcon
                  c="gray"
                  bg="transparent"
                  size="sm"
                  onClick={() => {
                    window.open(url.url, '_blank', 'noopener noreferrer');
                  }}
                >
                  <IconExternalLink />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete WTF Link">
                <ActionIcon
                  c="red"
                  bg="transparent"
                  size="sm"
                  onClick={() => {
                    onDelete(url.id)
                      .then(() => {
                        setRedirectSlug('/dashboard');
                      })
                      .catch((error) => {
                        console.error(error);
                        setErrorMessage('Could not delete WTF Link.');
                      });
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Table.Td>
        </Table.Tr>
      );
    });
  };

  useEffect(() => {
    if (redirectSlug) {
      if (redirectSlug.startsWith('/')) {
        router.push(redirectSlug);
      } else {
        router.push(`/go/${redirectSlug}/info`);
      }
    }
  }, [redirectSlug]);

  return (
    <Stack h="100%">
      <Box w="70%" mx="auto">
        <UrlInput onSubmit={onSubmit} />
      </Box>
      {errorMessage && (
        <Center>
          <Text c="red">{errorMessage}</Text>
        </Center>
      )}
      <Stack h="100%">
        {urls.length === 0 ? (
          <Center h="80%">
            <Text>You haven't created any WTF Links yet.</Text>
          </Center>
        ) : (
          <Table striped layout="fixed">
            <Table.Thead>
              <Table.Tr w="20%">
                <Table.Th>Slug</Table.Th>
                <Table.Th w="65%">URL</Table.Th>
                <Table.Th w="15%" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows()}</Table.Tbody>
          </Table>
        )}
      </Stack>
    </Stack>
  );
}
