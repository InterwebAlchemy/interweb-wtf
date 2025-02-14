import { Avatar, Blockquote, Center } from '@mantine/core';

export interface UrlDescriptionProps {
  url: string | URL;
  description?: string;
  title?: string;
  favicon?: string;
}

export default function UrlDescription({
  url,
  description,
  title,
  favicon,
}: UrlDescriptionProps): React.ReactElement {
  if (description && description !== 'undefined') {
    return (
      <Center w="90%" mx="auto" my="md" maw="640">
        <Blockquote
          radius="xs"
          iconSize={30}
          cite={`- ${title ? title : url.toString()}`}
          icon={favicon ? <Avatar src={favicon} radius="xs" size="md" /> : <></>}
        >
          {description}
        </Blockquote>
      </Center>
    );
  }

  return <></>;
}
