import { KNOWN_TRACKING_PARAM_PREFIXES } from '@/constants';

export function getTrackingParams(url: URL): Array<Record<string, string>> {
  const queryParams = url.searchParams.entries();

  const trackers = queryParams
    .filter(([key]) => KNOWN_TRACKING_PARAM_PREFIXES.some((prefix) => key.startsWith(prefix)))
    .map(([key, value]) => ({ [key]: value }));

  return [...trackers];
}

export function removeTrackingParams(url: URL): URL {
  const trackers = getTrackingParams(url);

  const newUrl = new URL(url.toString());

  Object.entries(trackers).forEach(([key]) => {
    newUrl.searchParams.delete(key);
  });

  return newUrl;
}
