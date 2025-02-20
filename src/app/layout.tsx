import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';
import '@/app/_styles/global.css';
import '@/app/_styles/codeblock.css';

import React from 'react';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APPLICATION_URL!),
  title: {
    default: 'Interweb.WTF',
    template: '%s | Interweb.WTF',
  },
  description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
  generator: 'Interweb.WTF',
  applicationName: 'Interweb.WTF',
  referrer: '',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Interweb.WTF',
    description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
    url: 'https://interweb.wtf',
    images: ['/assets/wtf-patient-recipe.png', '/favicon.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Interweb.WTF',
    description: 'A privacy-focused, user-centric link shortener for the modern interweb.',
    images: ['/assets/wtf-patient-recipe.png', '/favicon.svg'],
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="icon" href="/favicon.ico" />
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
