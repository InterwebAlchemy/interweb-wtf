import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Code, Flex, List, ListItem, Text, Title } from '@mantine/core';
import Screen from '@/app/_components/Screen';

//TODO: add docs and code examples about API keys and Authorization header

const SHORT_URL = 'https://bit.ly/1sNZMwL';
const EXPANDED_URL = 'https://en.wikipedia.org/wiki/Bitly';

const CURL_REQUEST = `curl https://interweb.wtf/is/${SHORT_URL}\\
    --header "Authorization: Bearer $API_KEY"`;

const CURL_JSON_REQUEST = `curl https://interweb.wtf/is/${SHORT_URL}/json\\
    --header "Authorization: Bearer $API_KEY"`;

const JSON_RESPONSE = `{
    url: "${EXPANDED_URL}"
}`;

export default function DocsPage() {
  return (
    <Screen title="Documentation">
      <Flex maw={680} justify="flex-start" direction="column">
        <Text>
          Here are the docs for using the <Code>/cli</Code> routes programmatically.
        </Text>
        <Title order={2}>Authentication</Title>
        <Text>
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          <Code>/cli</Code> API uses an <Code>Authorization</Code> HTTP Header with a{' '}
          <Anchor href="https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/">
            <Code>Bearer</Code> Token
          </Anchor>
          .
        </Text>
        <Text>
          <Text span inherit fw={700}>
            Note:
          </Text>{' '}
          in all of the examples below you should replace <Code>$API_KEY</Code> with an API Key you
          generated in <Code>Settings {'>'} Developer</Code>.
        </Text>
        <CodeHighlight code="Authorization: Bearer $API_KEY" language="shell" />
        <Title order={2}>Endpoints</Title>
        <Text>
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          <Code>/cli</Code> API provides endpoints for the most commonly used{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          features:
        </Text>
        <List>
          <ListItem>
            <Code>/go</Code>: Get the full URL that a WTF Link points to
          </ListItem>
          <ListItem>
            <Code>/is</Code>: Expand a shortlink URL from another provider
          </ListItem>
          <ListItem>
            <Code>/clean</Code>: Clean any URL of known tracking parameters
          </ListItem>
        </List>
        <Title order={3}>Response Types</Title>
        <Text>
          By default, these endpoints all return <Code>text/plain</Code> responses, but you can
          append <Code>/json</Code> to the endpoint URL to receive <Code>application/json</Code>{' '}
          responses instead.
        </Text>
        <Title order={2}>Examples</Title>
        <Title order={3}>Shortlink Expander Request</Title>
        <CodeHighlight language="shell" code={CURL_REQUEST} />
        <Title order={3}>Shortlink Expander Response</Title>
        <CodeHighlight language="shell" code={EXPANDED_URL} />
        <Title order={3}>Shortlink Expander JSON Request</Title>
        <CodeHighlight language="shell" code={CURL_JSON_REQUEST} />
        <Title order={3}>Shortlink Expander Response</Title>
        <CodeHighlight language="json" code={JSON_RESPONSE} />
      </Flex>
    </Screen>
  );
}
