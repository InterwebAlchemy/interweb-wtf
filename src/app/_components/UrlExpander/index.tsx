'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertTriangle, IconCopy, IconEyePlus, IconWorldWww } from '@tabler/icons-react';
import { useTimeout } from 'usehooks-ts';
import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Center, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CipherText from '@/app/_components/CipherText';
import UrlInput from '@/app/_components/UrlInput';
import UrlParams from '@/app/_components/UrlParams';
import { removeTrackingParams } from '@/app/_utils/url';
import { KNOWN_SHORTENERS } from '@/constants';

export default function UrlExpander() {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [cleanUrl, setCleanUrl] = useState('');
  const [loadingNotificationId, setLoadingNotificationId] = useState<string | null>(null);

  const onSubmit = async (url: string): Promise<void> => {
    let urlString = url;

    const urlObject = new URL(urlString);

    if (!KNOWN_SHORTENERS.includes(urlObject.hostname)) {
      notifications.show({
        title: 'Unknown URL Shortener',
        message: (
          <Stack>
            <Text>
              {urlObject.hostname} is not a known URL shortener. Please try a different shortlink or{' '}
              <Anchor href={process.env.NEXT_PUBLIC_SHORTENER_REQUEST_URL}>
                request support for {urlObject.hostname}
              </Anchor>
              .
            </Text>
          </Stack>
        ),
        color: 'red',
        icon: <IconAlertTriangle />,
      });

      setShortUrl('');
      setIsExpanded(false);
      setShouldRedirect(false);
    } else {
      // check for suffixed `+` in bit.ly URLs that shows the link destination
      if (urlObject.hostname === 'bit.ly' && url.endsWith('+')) {
        urlString = url.slice(0, -1);
      }

      setShortUrl(urlString);

      try {
        // try to fetch from the browser first and see if the underlying
        // URL has permissive CORS headers
        const response = await fetch(urlString)
          .then(async (response) => {
            if (response.ok) {
              return response;
            }
          })
          .catch(async (error) => {
            console.error(error);

            // if we can't fetch the URL directly, try to fetch it from the server
            const response = await fetch('/api/fetch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url: urlString }),
            })
              .then(async (res) => {
                if (res.ok) {
                  return await res.json();
                }
              })
              .catch((error) => {
                console.error('ERROR:', error);

                notifications.show({
                  title: 'Could not connect to the URL expansion service',
                  message: 'Please try again later.',
                  color: 'red',
                  icon: <IconAlertTriangle />,
                });
              });

            return response;
          });

        if (response?.url) {
          const fullUrl = response.url;

          if (fullUrl) {
            setResolvedUrl(fullUrl);
            setCleanUrl(removeTrackingParams(new URL(fullUrl)).toString());
            const notificationId = notifications.show({
              title: 'Expanding shortlink...',
              message: "We're expanding your shortlink. This may take a little while.",
              color: 'violet',
              icon: <IconEyePlus />,
              withCloseButton: false,
              loading: true,
              autoClose: false,
            });

            setLoadingNotificationId(notificationId);

            fetch(`/api/expand`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: fullUrl.toString(),
                userAgent: navigator.userAgent,
                shortUrl: urlString,
              }),
            })
              .then(async (res) => {
                return await res.json();
              })
              .then(() => {
                setIsExpanded(true);
              });
          }
        }
      } catch (error) {
        console.error('ERROR:', error);

        notifications.show({
          title: 'Could not expand URL',
          message: 'Please try again later.',
          color: 'red',
          icon: <IconAlertTriangle />,
        });
      }
    }
  };

  useEffect(() => {
    if (isResolved && isExpanded) {
      if (loadingNotificationId) {
        notifications.hide(loadingNotificationId);
      }

      notifications.show({
        title: 'Shortlink expanded',
        message:
          "Your shortlink has been expanded. We'll redirect you to the Shortlink Inspector details page in 5 seconds. Close this notification to stop the redirect.",
        color: 'violet',
        icon: <IconEyePlus />,
        loading: true,
        autoClose: 5001,
        onClose: () => {
          setShouldRedirect(false);
        },
      });

      setShouldRedirect(true);
    }
  }, [isResolved, isExpanded]);

  useTimeout(
    () => {
      if (shouldRedirect) {
        router.push(`/is/${shortUrl}`);
      }
    },
    shouldRedirect ? 5000 : null
  );

  return (
    <Center pos="relative" w="100%">
      <Stack w="100%" h="100%">
        {!shortUrl && (
          <UrlInput
            placeholder="https://bit.ly/short-url"
            submitButton={<IconEyePlus />}
            onSubmit={onSubmit}
            submitTitle="Expand URL"
            readOnly={shortUrl.length > 0}
          />
        )}

        {shortUrl &&
          (isResolved ? (
            <Stack>
              <UrlInput
                defaultValue={resolvedUrl}
                submitButton={<IconCopy />}
                onSubmit={onSubmit}
                submitTitle="Copy URL"
                submitVariant="transparent"
                submitColor="teal"
                readOnly
              />
              <Title order={4} mt={40}>
                Clean URL
              </Title>
              <CodeHighlight code={cleanUrl} copyLabel="Copy Clean URL" language="url" mb={80} />
              <UrlParams url={resolvedUrl} />
            </Stack>
          ) : (
            <Group
              px="xs"
              align="center"
              bd="1px solid #ccc"
              style={{ borderRadius: '3px' }}
              preventGrowOverflow
              wrap="nowrap"
            >
              <IconWorldWww color="var(--input-section-color, var(--mantine-color-dimmed))" />
              <Text
                span
                c="violet"
                size="18px"
                truncate="end"
                maw="90%"
                py="md"
                title={resolvedUrl}
              >
                {resolvedUrl ? (
                  <CipherText
                    defaultText={shortUrl}
                    targetText={resolvedUrl}
                    action="transform"
                    onFinish={() => {
                      setIsResolved(true);
                    }}
                  />
                ) : (
                  'Expanding URL...'
                )}
              </Text>
            </Group>
          ))}
      </Stack>
    </Center>
  );
}
