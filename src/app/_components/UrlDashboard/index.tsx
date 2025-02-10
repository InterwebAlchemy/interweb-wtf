'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Center, Stack, Table, Text } from '@mantine/core';
import UrlInput from '@/app/_components/UrlInput';
import { Tables } from '@/types/supabase';

export interface UrlDashboardProps {
  urls: Array<Tables<'short_urls'>>;
}

export default function UrlDashboard({ urls }: UrlDashboardProps) {
  const [dashboardUrls, setDashboardUrls] = useState(urls);

  const onSubmit = async (url: string): Promise<void> => {
    const newUrl = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      }
    });

    if (newUrl) {
      console.log(newUrl);
      setDashboardUrls((prev) => {
        return [...prev, newUrl];
      });
    }
  };

  const renderRows = () => {
    return dashboardUrls.map((url) => {
      return (
        <Table.Tr key={url.id}>
          <Table.Td>
            <Link href={`/manage/${url.slug}`}>{url.slug}</Link>
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
        {dashboardUrls.length === 0 ? (
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
