import { Badge, Button, Text } from '@mantine/core';

export interface UrlParamProps {
  name: string;
  value: string;
  tracker?: 'known' | 'potential' | 'unknown';
  onClick?: (param: { name: string; value?: string }) => void;
}

export default function UrlParam({
  name,
  value,
  tracker = 'unknown',
  onClick,
}: UrlParamProps): React.ReactElement {
  const getTagColor = (): string => {
    switch (tracker) {
      case 'known':
        return 'red';
      case 'potential':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const color = getTagColor();
  const variant = tracker === 'known' || tracker === 'potential' ? 'outline' : 'light';
  const title = `${name} is ${tracker === 'unknown' ? 'not a known' : `a ${tracker}`} tracking parameter.${typeof onClick === 'function' ? ' Click to add/remove it from the URL.' : ''}`;
  const textDecoration = tracker === 'known' || tracker === 'potential' ? 'line-through' : 'none';

  const Wrapper = typeof onClick === 'function' ? Button : Badge;

  const wrapperProps =
    typeof onClick === 'function'
      ? { onClick: () => onClick({ name, value }), component: Badge, title }
      : {};

  return (
    <Wrapper
      {...wrapperProps}
      variant={variant}
      color={color}
      leftSection={
        <Text span inherit fw={700}>
          {name}:
        </Text>
      }
      radius="sm"
    >
      <Text span inherit fw={300} td={textDecoration} tt="initial">
        {value}
      </Text>
    </Wrapper>
  );
}
