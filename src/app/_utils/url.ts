import {
  DOMAIN_SPECIFIC_TRACKING_PARAMS,
  KNOWN_TRACKING_PARAM_PREFIXES,
  KNOWN_TRACKING_PARAMS,
} from '@/constants';

export function getTrackingParams(url: URL): Array<Record<string, string>> {
  const queryParams = [...url.searchParams.entries()];

  const prefixedTrackers = queryParams
    .filter(([key]) => KNOWN_TRACKING_PARAM_PREFIXES.some((prefix) => key.startsWith(prefix)))
    .map(([key, value]) => ({ [key]: value }));

  const trackers = queryParams
    .filter(([key]) => KNOWN_TRACKING_PARAMS.includes(key))
    .map(([key, value]) => ({ [key]: value }));

  const domainTrackers = queryParams
    .filter(([key]) => DOMAIN_SPECIFIC_TRACKING_PARAMS[url.hostname]?.includes(key))
    .map(([key, value]) => ({ [key]: value }));

  return [...domainTrackers, ...trackers, ...prefixedTrackers];
}

export function removeTrackingParams(url: URL): URL {
  const trackers = getTrackingParams(url);

  const newUrl = new URL(url.toString());

  trackers.forEach((tracker) => {
    const key = Object.keys(tracker)[0];

    if (newUrl.searchParams.has(key)) {
      newUrl.searchParams.delete(key);
    }
  });

  return newUrl;
}
