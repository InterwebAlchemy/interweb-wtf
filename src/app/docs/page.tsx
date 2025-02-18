import { IconAlertCircle } from '@tabler/icons-react';
import { CodeHighlight } from '@mantine/code-highlight';
import { Alert, Anchor, Code, Flex, List, ListItem, Text, Title } from '@mantine/core';
import Screen from '@/app/_components/Screen';

//TODO: add docs and code examples about API keys and Authorization header

const SHORT_URL = 'https://bit.ly/1sNZMwL';
const EXPANDED_URL = 'https://en.wikipedia.org/wiki/Bitly';
const API_BASE_URL = 'https://interweb.wtf/cli';
const API_VERSION = 'v0';
const API_URL = `${API_BASE_URL}/${API_VERSION}`;

const CURL_REQUEST = `curl --location ${API_URL}/is/${SHORT_URL}\\
    --header "Authorization: Bearer $API_KEY"`;

const CURL_JSON_REQUEST = `curl --location ${API_URL}/is/${SHORT_URL}/json\\
    --header "Authorization: Bearer $API_KEY"`;

const JSON_RESPONSE = `{
    url: "${EXPANDED_URL}"
}`;

export default function DocsPage() {
  return (
    <Screen title="Documentation">
      <Flex maw={680} justify="flex-start" direction="column">
        <Alert icon={<IconAlertCircle />} color="teal">
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          API is currently in beta and this documentation is currently under construction.
        </Alert>
        <Text>
          Here are the docs for using the{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          programmatically.
        </Text>
        <Title order={2}>Authentication</Title>
        <Text>
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          API uses an <Code>Authorization</Code> HTTP Header with a{' '}
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
          generated in{' '}
          <Anchor href="/settings#developer">
            <Code>Settings {'>'} Developer</Code>
          </Anchor>
          .
        </Text>
        <CodeHighlight code="Authorization: Bearer $API_KEY" language="shell" />
        <Title order={2}>Endpoints</Title>
        <CodeHighlight code={`${API_URL}`} language="shell" />
        <Text>
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          API provides endpoints for the most commonly used{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          features:
        </Text>
        <List>
          <ListItem>
            <Code>{API_URL}/go</Code>: Get the full URL that a WTF Link points to
          </ListItem>
          <ListItem>
            <Code>{API_URL}/is</Code>: Expand a shortlink URL from another provider
          </ListItem>
          <ListItem>
            <Code>{API_URL}/clean</Code>: Clean any URL of known tracking parameters
          </ListItem>
        </List>
        <Text>
          <Text span inherit fw={700}>
            Note:
          </Text>{' '}
          The{' '}
          <Text span inherit c="violet">
            Interweb.WTF
          </Text>{' '}
          API uses <Code>/cli</Code> instead of <Code>/api</Code> as a base path as a reminder that
          these routes are mostly for CLI applications that only expect to be able to send and
          receive simple text rather than fully-featured API responses.
        </Text>
        <Title order={3}>Response Types</Title>
        <Text>
          By default, these endpoints all return <Code>text/plain</Code> responses, but you can
          append <Code>/json</Code> to the endpoint URL to receive <Code>application/json</Code>{' '}
          responses instead.
        </Text>
        <Text>
          <Text span inherit fw={700}>
            Note:
          </Text>{' '}
          All of the endpoints that include the ability to append a full URL (
          <Text span inherit fw={700}>
            example:
          </Text>{' '}
          <Code>/cli/v0/is/{SHORT_URL}</Code>) may redirect you based on the server's handling of{' '}
          <Code>/</Code> characters in the URL. You will need to make sure you are following
          redirects to resolve the API call. For example, if you are using <Code>curl</Code>, the{' '}
          <Anchor href="https://everything.curl.dev/http/redirects.html#tell-curl-to-follow-redirects">
            <Code>--location</Code>
          </Anchor>{' '}
          flag follows redirects and passes any relevant authentication along as long as the
          redirect has the same host.
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
