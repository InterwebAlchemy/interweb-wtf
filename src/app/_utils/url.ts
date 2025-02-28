import {
  DOMAIN_SPECIFIC_POTENTIAL_TRACKING_PARAMS,
  DOMAIN_SPECIFIC_TRACKING_PARAMS,
  KNOWN_TRACKING_PARAM_PREFIXES,
  KNOWN_TRACKING_PARAMS,
  POTENTIAL_TRACKING_PARAMS,
} from '@/constants';

/**
 * Find domain-specific parameters from a record based on the URL's hostname
 * @param url - The URL to check
 * @param domainRecord - A record mapping domains to string arrays of parameters
 * @returns Parameters that match the domain-specific rules, or empty array if no match
 */
function getDomainSpecificParams<T extends Record<string, string[]>>(
  url: URL,
  domainRecord: T
): string[] {
  const matchingDomain = Object.keys(domainRecord).find((domain) => url.hostname.endsWith(domain));

  if (!matchingDomain) {
    return [];
  }

  return domainRecord[matchingDomain as keyof T] || [];
}

export function getTrackingParams(url: URL): {
  knownTrackers: string[];
  potentialTrackers: string[];
} {
  const queryParams = [...url.searchParams.entries()];
  const knownTrackers: string[] = [];
  const potentialTrackers: string[] = [];

  // Process known trackers (from the existing logic)
  queryParams.forEach(([key, _]) => {
    // Check prefixed trackers
    if (KNOWN_TRACKING_PARAM_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      knownTrackers.push(key);
    }
    // Check known trackers
    else if (KNOWN_TRACKING_PARAMS.includes(key)) {
      knownTrackers.push(key);
    }
  });

  // Domain specific known trackers
  const domainSpecificKnownParams = getDomainSpecificParams(url, DOMAIN_SPECIFIC_TRACKING_PARAMS);

  queryParams.forEach(([key]) => {
    if (domainSpecificKnownParams.includes(key)) {
      knownTrackers.push(key);
    }
  });

  // Process potential trackers (new logic)
  // Note: POTENTIAL_TRACKING_PARAMS is currently empty but type-safe for future use
  if (POTENTIAL_TRACKING_PARAMS.length > 0) {
    queryParams.forEach(([key]) => {
      if ((POTENTIAL_TRACKING_PARAMS as string[]).includes(key) && !knownTrackers.includes(key)) {
        potentialTrackers.push(key);
      }
    });
  }

  // Domain specific potential trackers
  const domainSpecificPotentialParams = getDomainSpecificParams(
    url,
    DOMAIN_SPECIFIC_POTENTIAL_TRACKING_PARAMS
  );

  queryParams.forEach(([key]) => {
    if (
      domainSpecificPotentialParams.includes(key) &&
      !knownTrackers.includes(key) &&
      !potentialTrackers.includes(key)
    ) {
      potentialTrackers.push(key);
    }
  });

  return { knownTrackers, potentialTrackers };
}

export function removeTrackingParams(url: URL): URL {
  const { knownTrackers, potentialTrackers } = getTrackingParams(url);

  const newUrl = new URL(url.toString());

  const trackersToRemove = [...knownTrackers, ...potentialTrackers];

  trackersToRemove.forEach((key) => {
    if (newUrl.searchParams.has(key)) {
      newUrl.searchParams.delete(key);
    }
  });

  return newUrl;
}
