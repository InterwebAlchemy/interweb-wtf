import { Badge, Text } from '@mantine/core';

export interface UrlParamProps {
  name: string;
  value: string;
  tracker?: boolean;
}

export default function UrlParam({ name, value, tracker }: UrlParamProps): React.ReactElement {
  const variant = tracker ? 'outline' : 'light';
  const color = tracker ? 'red' : 'gray';
  const title = tracker ? 'This is a known tracking parameter' : 'Not a known tracking parameter.';

  return (
    <Badge
      variant={variant}
      color={color}
      leftSection={
        <Text span inherit fw={700}>
          {name}:
        </Text>
      }
      radius="sm"
      title={title}
    >
      <Text span inherit fw={300} tt="initial">
        {value}
      </Text>
    </Badge>
  );
}
