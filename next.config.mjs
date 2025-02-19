import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-frontmatter'], ['remark-mdx-frontmatter'], ['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      ['rehype-autolink-headings'],
      ['@shikijs/rehype', { theme: 'tokyo-night', inline: 'tailing-curly-colon' }],
    ],
  },
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withMDX(
  withBundleAnalyzer({
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    serverExternalPackages: ['@sparticuz/chromium'],
    experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    async rewrites() {
      return [
        {
          source: `/is/:url`,
          destination: `/is`,
        },
      ];
    },
  })
);
