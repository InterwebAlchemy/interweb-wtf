'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, Box, Center, Stack, Table, Text } from '@mantine/core';
import { createClient } from '@/app/_adapters/supabase/client';
import UrlInput from '@/app/_components/UrlInput';
import { Tables } from '@/types/supabase';

export interface UrlDashboardProps {
  urls: Array<Tables<'short_urls'>>;
}

export default function UrlDashboard({ urls }: UrlDashboardProps) {
  const [redirectSlug, setRedirectSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (url: string): Promise<void> => {
    try {
      const slug = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, userAgent: navigator.userAgent }),
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
            await fetch('/api/summarize', {
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
              .then(async (response) => {
                console.log(response);
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
    console.log('Deleting:', id);

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
      return (
        <Table.Tr key={url.id}>
          <Table.Td>
            <Link href={`/go/${url.slug}/info`}>{url.slug}</Link>
          </Table.Td>
          <Table.Td>
            <Text>{url.url}</Text>
          </Table.Td>
          <Table.Td>
            <Text>{url.updated_at}</Text>
          </Table.Td>
          <Table.Td>
            <ActionIcon
              c="red"
              bg="transparent"
              size="sm"
              title="Delete WTF Link"
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
          </Table.Td>
        </Table.Tr>
      );
    });
  };

  useEffect(() => {
    if (redirectSlug) {
      if (redirectSlug.startsWith('/')) {
        redirect(redirectSlug);
      } else {
        redirect(`/go/${redirectSlug}/info`);
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
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text>Slug</Text>
                </Table.Th>
                <Table.Th>
                  <Text>URL</Text>
                </Table.Th>
                <Table.Th>
                  <Text>Updated</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows()}</Table.Tbody>
          </Table>
        )}
      </Stack>
    </Stack>
  );
}
