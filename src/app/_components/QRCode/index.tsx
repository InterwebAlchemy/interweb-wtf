'use client';

import { QRCodeCanvas } from 'qrcode.react';

export interface QRCodeProps {
  url: URL | string;
  title?: string;
}

export default function QRCode({ url, title }: QRCodeProps): React.ReactElement {
  return (
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
  );
}
