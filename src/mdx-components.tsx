import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { Anchor, Blockquote, Image, List, ListItem, Table, Text, Title } from '@mantine/core';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: any) => <Title order={1} {...props} />,
    h2: (props: any) => <Title order={2} {...props} />,
    h3: (props: any) => <Title order={3} {...props} />,
    p: (props: any) => <Text {...props} />,
    a: (props: any) => {
      if (props.href.startsWith('/')) {
        return <Anchor component={Link} {...props} />;
      }

      return <Anchor {...props} />;
    },
    ul: (props: any) => <List {...props} />,
    li: (props: any) => <ListItem {...props} />,
    img: (props: any) => <Image {...props} />,
    blockquote: (props: any) => <Blockquote {...props} />,
    table: (props: any) => <Table {...props} />,
    thead: (props: any) => <Table.Thead {...props} />,
    tbody: (props: any) => <Table.Tbody {...props} />,
    tr: (props: any) => <Table.Tr {...props} />,
    td: (props: any) => <Table.Td {...props} />,
    th: (props: any) => <Table.Th {...props} />,
    // TODO: add components for custom mdx elements
  };
}
