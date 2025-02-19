import { codeToHtml, type BuiltinTheme, type BundledLanguage } from 'shiki';
import { Flex } from '@mantine/core';
import CopyButton, { type CopyButtonProps } from './CopyButton';

interface Props {
  children: string;
  inline?: boolean;
  lang: BundledLanguage;
  theme?: BuiltinTheme;
  copyButton?: boolean;
  copyButtonProps?: CopyButtonProps;
}

export default async function CodeBlock({
  children,
  // @ts-expect-error - TODO: figure out why shiki doesn't export the `text`/`plain` language in BundledLanguage
  lang = 'text',
  inline = false,
  theme = 'tokyo-night',
  copyButton = true,
  copyButtonProps = {},
}: Props) {
  const out = await codeToHtml(children, {
    lang,
    theme: theme || 'tokyo-night',
    structure: inline ? 'inline' : 'classic',
  });

  return inline ? (
    <code className="shiki" dangerouslySetInnerHTML={{ __html: out }} />
  ) : (
    <Flex className="codeblock">
      {copyButton && <CopyButton content={children} {...copyButtonProps} />}
      <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: out }} />
    </Flex>
  );
}
