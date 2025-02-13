import type { PageMetadata } from '@/types';

// prefer og:title -> meta:title -> twitter:title -> <title>
export function getPageTitle(metadata: PageMetadata): string {
  const title = '';

  // get title-like items from page metadata
  const titles =
    metadata?.filter(
      (meta) =>
        meta?.name === 'title' ||
        (typeof meta?.property !== 'undefined' && meta.property.endsWith(':title'))
    ) ?? [];

  if (titles.length > 0) {
    const ogTitle = titles.find((meta) => meta?.property === 'og:title');

    if (ogTitle) {
      return ogTitle?.content;
    }

    const metaTitle = titles.find((meta) => meta?.name === 'title');

    if (metaTitle) {
      return metaTitle?.content;
    }

    const twitterTitle = titles.find((meta) => meta?.property === 'twitter:title');

    if (twitterTitle) {
      return twitterTitle?.content;
    }
  }

  const pageTitle = metadata?.find((meta) => Object.hasOwn(meta, 'title'))?.title;

  return pageTitle || title;
}

// prefer og:description -> description -> twitter:description
export function getPageDescription(metadata: PageMetadata): string {
  const description = '';

  const descriptions =
    metadata?.filter(
      (meta) =>
        meta?.name === 'description' ||
        (typeof meta?.property !== 'undefined' && meta.property.endsWith(':description'))
    ) ?? [];

  if (descriptions.length > 0) {
    const ogDescription = descriptions.find((meta) => meta?.property === 'og:description');

    if (ogDescription) {
      return ogDescription?.content;
    }

    const metaDescription = descriptions.find((meta) => meta?.name === 'description');

    if (metaDescription) {
      return metaDescription?.content;
    }

    const twitterDescription = descriptions.find(
      (meta) => meta?.property === 'twitter:description'
    );

    if (twitterDescription) {
      return twitterDescription?.content;
    }
  }

  return description;
}
