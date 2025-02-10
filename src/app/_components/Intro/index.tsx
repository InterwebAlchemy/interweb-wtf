import { Center, Code, Text } from '@mantine/core';

export default function Intro() {
  return (
    <Center w="50%" h="100%">
      <Text>
        A link shortener for the modern web. WTFLinks work just like the shortlinks you're used to
        except that they don't track you, once they've been created the URL they point to cannot be
        updated, and you can add <Code>/info</Code> to any WTFLink to see where it's taking you.
      </Text>
    </Center>
  );
}
