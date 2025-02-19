import type { Metadata, ResolvingMetadata } from 'next';
import Screen from '@/app/_components/Screen';
import { CURRENT_API_VERSION } from '@/constants';

import '@/app/_styles/markdown.css';

import { Flex } from '@mantine/core';

type MetaDataProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  _props: MetaDataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentTitle: Metadata['title'] = (await parent).title;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  const title = `API ${CURRENT_API_VERSION} Documentation${parentTitle?.absolute ? ` | ${parentTitle.absolute}` : ''}`;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: `API Documentation for the Interweb.WTF API (interweb.wtf/cli/${CURRENT_API_VERSION})`,
    openGraph: {
      title,
      images: [...previousImages],
    },
  };
}

export default async function MDXLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Record<string, string>>;
}) {
  console.log(params);
  return (
    <Screen title="Documentation" className="markdown">
      <Flex direction="column" maw="760px">
        {children}
      </Flex>
    </Screen>
  );
}
