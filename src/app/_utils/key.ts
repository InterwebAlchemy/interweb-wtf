/**
 * Generates a random API key
 * @returns The generated API key
 */
export const generateKey = (): string => {
  // generate random values for key length of WTF_API_KEY_LENGTH using crypto.getRandomValues
  const randomValues = new Uint8Array(parseInt(process.env.WTF_API_KEY_LENGTH!, 10));

  // convert the random values to a string
  const key = Array.from(crypto.getRandomValues(randomValues))
    .map((byte) => byte.toString(36))
    .join('');

  return key;
};

/**
 * Hashes an API key
 * @param key - The API key to hash
 * @returns The hashed API key
 */
export const hashKey = async (key: string): Promise<string> => {
  const secret = process.env.WTF_API_KEY_SECRET;

  if (!secret) {
    throw new Error('WTF_API_KEY_SECRET is not set');
  }

  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${secret}::${key}`));

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Prefixes an API key
 * @param key - The API key to prefix
 * @returns The prefixed API key
 */
export const prefixKey = (key: string): string => {
  return `${process.env.WTF_API_KEY_PREFIX}${process.env.WTF_API_KEY_SEPARATOR}${process.env.WTF_API_KEY_VERSION}${process.env.WTF_API_KEY_SEPARATOR}${key}`;
};

/**
 * Hashes an incoming API key to query the DB
 * @param key - The API key to hash
 * @returns The hashed API key
 */
export const hashIncomingKey = async (key: string): Promise<string> => {
  // remove prefix, separator, and version
  const fullPrefix = `${process.env.WTF_API_KEY_PREFIX}${process.env.WTF_API_KEY_SEPARATOR}${process.env.WTF_API_KEY_VERSION}${process.env.WTF_API_KEY_SEPARATOR}`;
  const keyWithoutPrefix = key.replace(fullPrefix, '');

  // hash the key
  const hash = await hashKey(keyWithoutPrefix);

  return hash;
};

/**
 * Obfuscates an API key
 * @param key - The API key to obfuscate
 * @param visibleChars - The number of characters to show at either end of the key
 * @returns The obfuscated API key
 */
export const obfuscateKey = (key: string, visibleChars: number = 4): string => {
  // only show the first 4 and last 4 characters of the key, replace the rest with *
  return (
    key.slice(0, visibleChars) +
    '*'.repeat(key.length - visibleChars * 2) +
    key.slice(-visibleChars)
  );
};
