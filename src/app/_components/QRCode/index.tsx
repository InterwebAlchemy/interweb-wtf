'use client';

import { IconDownload } from '@tabler/icons-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button, Stack } from '@mantine/core';

export interface QRCodeProps {
  url: URL | string;
  title?: string;
}

export default function QRCode({ url, title }: QRCodeProps): React.ReactElement {
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `wtf-${new URL(url).pathname.split('/').at(-1)}.png`;
      link.click();
    }
  };

  return (
    <Stack>
      <QRCodeCanvas
        value={url.toString()}
        title={title}
        size={256}
        level="H"
        imageSettings={{
          src: new URL('/favicon.svg', process.env.NEXT_PUBLIC_APPLICATION_URL).toString(),
          height: 32,
          width: 32,
          excavate: true,
        }}
      />
      <Button onClick={downloadQRCode} leftSection={<IconDownload />}>
        Download QR Code
      </Button>
    </Stack>
  );
}
