import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: process.env.NEXT_PUBLIC_APPLICATION_URL!,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/clean`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/expand`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/clean`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/expand`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/shorten`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/cli`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/cli/v0`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/cli/v0/clean`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/cli/v0/go`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/cli/v0/is`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/interfaces`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/interfaces/api`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/interfaces/url`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/interfaces/web`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/concepts`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/concepts/shortlinks`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/concepts/tracking`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/docs/concepts/wtf-links`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/about`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/privacy`,
      lastModified: new Date().toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/request-invite`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/login`,
      lastModified: new Date().toString(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  return routes;
}
