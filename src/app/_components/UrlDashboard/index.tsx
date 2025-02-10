'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Box, Center, Stack, Table, Text } from '@mantine/core';
import UrlInput from '@/app/_components/UrlInput';
import { Tables } from '@/types/supabase';

export interface UrlDashboardProps {
  urls: Array<Tables<'short_urls'>>;
}

export default function UrlDashboard({ urls }: UrlDashboardProps) {
  const onSubmit = async (url: string): Promise<void> => {
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
      })
      .then(async (response) => {
        const { slug, id } = response;

        console.log(slug, id, response);

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

        return slug;
      })
      .catch((error) => {
        console.error(error);
      });

    if (slug) {
      redirect(`/go/${slug}/info`);
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
        </Table.Tr>
      );
    });
  };

  return (
    <Stack h="100%">
      <Box w="70%" mx="auto">
        <UrlInput onSubmit={onSubmit} />
      </Box>
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
