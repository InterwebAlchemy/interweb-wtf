'use client';

import { useEffect, useState, type PropsWithoutRef } from 'react';
import { useInterval, useIsClient } from 'usehooks-ts';

const printableCharacters = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

const BASE_MAX_ITERATIONS = 36;
const BASE_SPEED = 120;

const defaultMaxIterations = {
  encode: BASE_MAX_ITERATIONS,
  decode: BASE_MAX_ITERATIONS,
  transform: BASE_MAX_ITERATIONS,
};

const defaultSpeed = {
  encode: BASE_SPEED,
  decode: BASE_SPEED,
  transform: BASE_SPEED * 1.5,
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
      // remove a random number of characters less than the difference between the text lengths
      // from the end of the string; clamped between 1 and 5
      const maxNumberOfCharactersToRemove = Math.min(
        Math.max(1, text.length - targetText.length),
        5
      );

      let numberOfCharactersToRemove =
        Math.floor(Math.random() * maxNumberOfCharactersToRemove) + 1;

      // fully cut the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToRemove = text.length - targetText.length;
      }

      transformedText = transformedText.slice(0, -1 * numberOfCharactersToRemove);
    } else if (text.length < targetText.length) {
      // add a random number of characters less than the difference between the text lengths
      // to the end of the string; clamped between 1 and 5
      const maxNumberOfCharactersToAdd = Math.min(Math.max(1, targetText.length - text.length), 5);

      let numberOfCharactersToAdd = Math.floor(Math.random() * maxNumberOfCharactersToAdd) + 1;

      // fully pad the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToAdd = targetText.length - text.length;
      }

      for (let i = 0; i < numberOfCharactersToAdd; i += 1) {
        transformedText +=
          printableCharacters[Math.floor(Math.random() * printableCharacters.length)];
      }
    }

    // choose random number of characters to reveal between 1 and 5
    const numberOfCharactersToReveal = Math.floor(Math.random() * 3) + 1;

    let charactersRevealed = 0;

    return transformedText
      .split('')
      .map((char, i) => {
        if (transformedText[i] !== targetText[i]) {
          if ((Math.random() > 0.5 && !hasRevealed) || iterations >= maxIterations) {
            charactersRevealed += 1;

            if (charactersRevealed >= numberOfCharactersToReveal) {
              setHasRevealed(true);
            }

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

    // choose random number of characters to reveal between 1 and 5
    const numberOfCharactersToReveal = Math.floor(Math.random() * 5) + 1;

    let charactersRevealed = 0;

    return text
      .split('')
      .map((char, i) => {
        if (text[i] !== defaultText[i]) {
          if ((Math.random() > 0.5 && !hasRevealed) || iterations >= maxIterations) {
            charactersRevealed += 1;

            if (charactersRevealed >= numberOfCharactersToReveal) {
              setHasRevealed(true);
            }

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
