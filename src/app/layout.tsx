import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/app/_styles/global.css';

import React from 'react';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'interweb.wtf',
  description: 'A link shortener for the modern interweb.',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body suppressHydrationWarning>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
