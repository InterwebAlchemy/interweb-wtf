'use client';

import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

const printableCharacters = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

export interface CipherTextProps {
  text: string;
  action?: 'encode' | 'decode';
  speed?: number;
  maxIterations?: number;
}

export default function CipherText({
  text,
  action = 'decode',
  speed = 120,
  maxIterations = 36,
}: CipherTextProps): React.ReactElement {
  const [iterations, setIterations] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  const [formattedText, setFormattedText] = useState(
    action === 'decode'
      ? text
          .split('')
          .map(() => printableCharacters[Math.floor(Math.random() * printableCharacters.length)])
          .join('')
      : text
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useInterval(
    () => {
      setHasRevealed(false);

      setIterations((previousIterations) => previousIterations + 1);

      setFormattedText((previousText) => {
        return action === 'decode'
          ? previousText
              .split('')
              .map((char, i) => {
                if (previousText[i] !== text[i]) {
                  if ((Math.random() > 0.75 || iterations >= maxIterations) && !hasRevealed) {
                    setHasRevealed(true);
                    return text[i];
                  }

                  return printableCharacters[
                    Math.floor(Math.random() * printableCharacters.length)
                  ];
                }

                return char;
              })
              .join('')
          : previousText;
      });
    },
    action === 'decode' ? (text !== formattedText ? speed : null) : null
  );

  return <>{isClient ? formattedText : text}</>;
}
