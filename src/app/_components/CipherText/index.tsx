'use client';

import { useEffect, useState, type PropsWithoutRef } from 'react';
import { useInterval, useIsClient } from 'usehooks-ts';

const printableCharacters = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

const BASE_MAX_ITERATIONS = 36;
const BASE_SPEED = 120;

const defaultMaxIterations = {
  encode: BASE_MAX_ITERATIONS,
  decode: BASE_MAX_ITERATIONS,
  transform: Math.ceil(BASE_MAX_ITERATIONS * 1.5),
};

const defaultSpeed = {
  encode: BASE_SPEED,
  decode: BASE_SPEED,
  transform: BASE_SPEED,
};

export interface CipherTextProps {
  defaultText: string;
  targetText?: string;
  action?: 'encode' | 'decode' | 'transform';
  speed?: number;
  maxIterations?: number;
  onFinish?: () => void;
}

export default function CipherText({
  defaultText,
  speed,
  maxIterations,
  onFinish,
  targetText = '',
  action = 'decode',
}: PropsWithoutRef<CipherTextProps>): React.ReactElement {
  const isClient = useIsClient();
  const [isDone, setIsDone] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [hasRevealed, setHasRevealed] = useState(false);

  // eslint-disable-next-line no-param-reassign
  speed = speed || defaultSpeed[action];
  // eslint-disable-next-line no-param-reassign
  maxIterations = maxIterations || defaultMaxIterations[action];

  if (action === 'transform' && !targetText) {
    throw new Error('targetText is required for action "transform"');
  }

  const [formattedText, setFormattedText] = useState(
    action === 'decode'
      ? defaultText
          .split('')
          .map(() => printableCharacters[Math.floor(Math.random() * printableCharacters.length)])
          .join('')
      : defaultText
  );

  // convert from text to targetText, padding with random characters or deleting characters as necessary
  const transformText = (text: string): string => {
    if (text === targetText) {
      setIsDone(true);

      return text;
    }

    let transformedText = text;

    if (text.length > targetText.length) {
      transformedText = text.slice(0, -1);
    }

    if (text.length < targetText.length) {
      transformedText =
        text + printableCharacters[Math.floor(Math.random() * printableCharacters.length)];
    }

    return transformedText
      .split('')
      .map((char, i) => {
        if (transformedText[i] !== targetText[i]) {
          if ((Math.random() > 0.75 || iterations >= maxIterations) && !hasRevealed) {
            setHasRevealed(true);
            return targetText[i];
          }

          return printableCharacters[Math.floor(Math.random() * printableCharacters.length)];
        }

        return char;
      })
      .join('');
  };

  const decodeText = (text: string): string => {
    if (text === defaultText) {
      setIsDone(true);

      return text;
    }

    return text
      .split('')
      .map((char, i) => {
        if (text[i] !== defaultText[i]) {
          if ((Math.random() > 0.75 || iterations >= maxIterations) && !hasRevealed) {
            setHasRevealed(true);
            return defaultText[i];
          }

          return printableCharacters[Math.floor(Math.random() * printableCharacters.length)];
        }

        return char;
      })
      .join('');
  };

  useEffect(() => {
    if (isDone) {
      onFinish?.();
    }
  }, [isDone]);

  useInterval(
    () => {
      setHasRevealed(false);

      setIterations((previousIterations) => previousIterations + 1);

      setFormattedText((previousText) => {
        switch (action) {
          case 'decode':
            return decodeText(previousText);
          case 'transform':
            return transformText(previousText);
          default:
            return previousText;
        }
      });
    },
    action === 'decode' || action === 'transform' ? (!isDone ? speed : null) : null
  );

  return <>{isClient ? formattedText : action === 'transform' ? targetText : defaultText}</>;
}
