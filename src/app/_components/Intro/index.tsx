import { Center, Code, Text } from '@mantine/core';

export default function Intro() {
  return (
    <Center w="100%" h="100%" maw="780">
      <Text>
        <Text span inherit fw="bold">
          A link shortener for the modern web.
        </Text>{' '}
        WTF Links work just like the shortlinks you're used to except that they don't track you,
        once they've been created the URL they point to cannot be updated, and you can add{' '}
        <Code>/info</Code> to any WTF Link to see where it's taking you.
      </Text>
    </Center>
  );
}
