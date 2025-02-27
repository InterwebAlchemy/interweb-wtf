import type { Metadata, ResolvingMetadata } from 'next';
import Screen from '@/app/_components/Screen';
import SidebarNav from '@/app/_components/SidebarNav';
import { CURRENT_API_VERSION, DOCS_NAV_ITEMS } from '@/constants';

import '@/app/_styles/markdown.css';

import { Group, Stack } from '@mantine/core';

export async function generateMetadata(
  /**
   * HACK: we don't actually care about the props, and the props in the reference docs
   * were throwing an error in the build.
   *
   * > Type error: Layout "src/app/docs/layout.tsx" has an invalid "generateMetadata" export:
   * > Type "MetadataProps" is not valid.
   *
   * Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
   */
  _props: unknown,
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
    description: `API Documentation for the Interweb.WTF CLI API (interweb.wtf/cli/${CURRENT_API_VERSION})`,
    openGraph: {
      title,
      images: [...previousImages],
    },
  };
}

export default async function MDXLayout({ children }: { children: React.ReactNode }) {
  return (
    <Screen title="Documentation" className="markdown-page">
      <Group w="100%" h="100%" gap={0} align="flex-start">
        <SidebarNav links={DOCS_NAV_ITEMS} />
        <Stack h="100%" w="80%" className="markdown" gap={0}>
          {children}
        </Stack>
      </Group>
    </Screen>
  );
}
