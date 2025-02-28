import type { NavItem } from '@/types';

// refresh after 2 weeks
export const STORAGE_REFRESH_INTERVAL = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

export const BASE_URL = process.env.NEXT_PUBLIC_APPLICATION_URL;
export const API_PATH = '/cli';
export const CURRENT_API_VERSION = 'v0';

export const API_URL = new URL(`${API_PATH}/${CURRENT_API_VERSION}`, BASE_URL).toString();

export const SETTINGS_NAV_ITEMS: NavItem[] = [
  {
    id: 'general',
    href: '/settings',
    label: 'Settings',
  },
  {
    id: 'developer',
    href: '/settings/developer',
    label: 'Developer',
  },
  {
    id: 'danger',
    href: '/settings/danger',
    label: 'Danger Zone',
  },
];

export const DOCS_NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    href: '/docs',
    label: 'Overview',
  },
  {
    id: 'shortener',
    href: '/docs/shorten',
    label: 'Shorten URLs',
  },
  {
    id: 'cleaner',
    href: '/docs/clean',
    label: 'Clean URLs',
  },
  {
    id: 'expander',
    href: '/docs/expand',
    label: 'Expand Shorlinks',
  },
  {
    id: 'interfaces',
    href: '/docs/interfaces',
    label: 'Interfaces',
    defaultOpened: true,
    children: [
      {
        id: 'web',
        href: '/docs/interfaces/web',
        label: 'Web Interface',
      },
      {
        id: 'url',
        href: '/docs/interfaces/url',
        label: 'URL Interface',
      },
      {
        id: 'api',
        href: '/docs/interfaces/api',
        label: 'API Interface',
      },
    ],
  },
  {
    id: 'concepts',
    href: '/docs/concepts',
    label: 'Concepts',
    defaultOpened: true,
    children: [
      {
        id: 'wtf-links',
        href: '/docs/concepts/wtf-links',
        label: 'WTF Links',
      },
      {
        id: 'tracking',
        href: '/docs/concepts/tracking',
        label: 'Tracking',
      },
      {
        id: 'shortlinks',
        href: '/docs/concepts/shortlinks',
        label: 'Shortlinks',
      },
    ],
  },
  {
    id: 'cli',
    href: '/docs/cli',
    label: 'Interweb.WTF CLI API',
    defaultOpened: true,
    children: [
      {
        id: 'v0',
        href: '/docs/cli/v0',
        label: 'CLI API v0',
        defaultOpened: true,
        children: [
          {
            id: 'go',
            href: '/docs/cli/v0/go',
            label: 'WTF Link Resolver',
          },
          {
            id: 'is',
            href: '/docs/cli/v0/is',
            label: 'Shortlink Expander',
          },
          {
            id: 'clean',
            href: '/docs/cli/v0/clean',
            label: 'URL Cleaner',
          },
        ],
      },
    ],
  },
];

// list of trusted domains that we won't need to check for trust or malware
export const KNOWN_DOMAINS = [
  'reddit.com',
  'wikipedia.org',
  'cnn.com',
  'bbc.co.uk',
  'ycombinator.com',
  'itch.io',
  'github.com',
  'tvtropes.org',
  'github.io',
  'npr.org',
  'metacritic.com',
  'steampowered.com',
  'huggingface.co',
  'linkedin.com',
  'stackoverflow.com',
  'stackexchange.com',
  'youtube.com',
];

// these shorteners have been tested and are known to work correctly
// with expansion, screenshots, and summarization
export const FULLY_SUPPORTED_SHORTENERS = ['bit.ly', 'buff.ly', 'youtu.be'];

// these shorteners have been tested and are known to have some issues
// with expansion, screenshots, or summarization
export const PARTIALLY_SUPPORTED_SHORTENERS = [
  // LinkedIn interstitial page shows destination URL, but needs to be clicked to expand
  'lnkd.in',
];

export const UNTESTED_SHORTENERS = [
  'w.wiki', // Wikipedia
  'goo.gl', // Google
  't.co', // Twitter
  'ow.ly',
  'trib.al',
  'is.gd',
  'tiny.cc',
  'dlvr.it',
  'shar.es',
  'su.pr',
  'fur.ly',
  'u.nu',
  'qr.ae',
  'adf.ly',
  'bit.do',
  'mcaf.ee',
  'cli.gs',
  'yfrog.com',
  'tinyarrows.com',
  'snipurl.com',
  'short.to',
  'bc.vc',
  'twitthis.com',
  'u.to',
  'j.mp',
];

// list of known URL shorteners that we will support expanding the URL for
export const KNOWN_SHORTENERS = [
  ...FULLY_SUPPORTED_SHORTENERS,
  ...PARTIALLY_SUPPORTED_SHORTENERS,
  ...UNTESTED_SHORTENERS,
];

// list out typical URL tracking query param prefixes like `utm_` and `fb_`
export const KNOWN_TRACKING_PARAM_PREFIXES = ['utm_', 'fb_', 'mc_', 'ref_'];

export const KNOWN_TRACKING_PARAMS = Array.from(
  new Set([
    // found in the wild: https://docs.cursor.com/context/rules-for-ai?ref=ghuntley.com
    'ref',

    // stolen from: https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/query-stripping/records
    'gclid',
    'dclid',
    'msclkid',
    '_openstat',
    'yclid',
    'wickedid',
    'twclid',
    '_hsenc',
    '__hssc',
    '__hstc',
    '__hsfp',
    'hsctatracking',
    'wbraid',
    'gbraid',
    'ysclid',
    'mc_eid',
    'oly_anon_id',
    'oly_enc_id',
    '__s',
    'vero_id',
    '_hsenc',
    'mkt_tok',
    'fbclid',

    // stolen from: https://github.com/brave/brave-core/blob/master/components/query_filter/utils.cc#27
    // https://github.com/brave/brave-browser/issues/9019
    '__hsfp',
    '__hssc',
    '__hstc',
    // https://github.com/brave/brave-browser/issues/8975
    '__s',
    // https://github.com/brave/brave-browser/issues/40716
    '_bhlid',
    // https://github.com/brave/brave-browser/issues/39575
    '_branch_match_id',
    '_branch_referrer',
    // https://github.com/brave/brave-browser/issues/33188
    '_gl',
    // https://github.com/brave/brave-browser/issues/9019
    '_hsenc',
    // https://github.com/brave/brave-browser/issues/34578
    '_kx',
    // https://github.com/brave/brave-browser/issues/11579
    '_openstat',
    // https://github.com/brave/brave-browser/issues/32488
    'at_recipient_id',
    'at_recipient_list',
    // https://github.com/brave/brave-browser/issues/37971
    'bbeml',
    // https://github.com/brave/brave-browser/issues/25238
    'bsft_clkid',
    'bsft_uid',
    // https://github.com/brave/brave-browser/issues/9879
    'dclid',
    // https://github.com/brave/brave-browser/issues/37847
    'et_rid',
    // https://github.com/brave/brave-browser/issues/33984
    'fb_action_ids',
    'fb_comment_id',
    // https://github.com/brave/brave-browser/issues/4239
    'fbclid',
    // https://github.com/brave/brave-browser/issues/18758
    'gbraid',
    // https://github.com/brave/brave-browser/issues/4239
    'gclid',
    // https://github.com/brave/brave-browser/issues/25691
    'guce_referrer',
    'guce_referrer_sig',
    // https://github.com/brave/brave-browser/issues/9019
    'hsCtaTracking',
    // https://github.com/brave/brave-browser/issues/33952
    'irclickid',
    // https://github.com/brave/brave-browser/issues/4239
    'mc_eid',
    // https://github.com/brave/brave-browser/issues/17507
    'ml_subscriber',
    'ml_subscriber_hash',
    // https://github.com/brave/brave-browser/issues/4239
    'msclkid',
    // https://github.com/brave/brave-browser/issues/31084
    'mtm_cid',
    // https://github.com/brave/brave-browser/issues/22082
    'oft_c',
    'oft_ck',
    'oft_d',
    'oft_id',
    'oft_ids',
    'oft_k',
    'oft_lk',
    'oft_sk',
    // https://github.com/brave/brave-browser/issues/13644
    'oly_anon_id',
    'oly_enc_id',
    // https://github.com/brave/brave-browser/issues/31084
    'pk_cid',
    // https://github.com/brave/brave-browser/issues/17451
    'rb_clickid',
    // https://github.com/brave/brave-browser/issues/17452
    's_cid',
    // https://github.com/brave/brave-browser/issues/43077
    'sc_customer',
    'sc_eh',
    'sc_uid',
    // https://github.com/brave/brave-browser/issues/40912
    'srsltid',
    // https://github.com/brave/brave-browser/issues/24988
    'ss_email_id',
    // https://github.com/brave/brave-browser/issues/18020
    'twclid',
    // https://github.com/brave/brave-browser/issues/33172
    'unicorn_click_id',
    // https://github.com/brave/brave-browser/issues/11817
    'vero_conv',
    'vero_id',
    // https://github.com/brave/brave-browser/issues/26295
    'vgo_ee',
    // https://github.com/brave/brave-browser/issues/18758
    'wbraid',
    // https://github.com/brave/brave-browser/issues/13647
    'wickedid',
    // https://github.com/brave/brave-browser/issues/11578
    'yclid',
    // https://github.com/brave/brave-browser/issues/33216
    'ymclid',
    'ysclid',

    // analytics
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',

    // mailchimp
    'mc_cid',
    'mc_eid',
    'mc_lid',
    'mc_mid',
    'mc_rid',
    'mc_t',
    'mc_uid',
  ])
);

const YOUTUBE_TRACKING_PARAMS = ['si', 'feature'];
const TWITTER_TRACKING_PARAMS = ['ref_src', 'ref_url'];

export const DOMAIN_SPECIFIC_TRACKING_PARAMS: Record<string, string[]> = {
  'youtube.com': YOUTUBE_TRACKING_PARAMS,
  'youtu.be': YOUTUBE_TRACKING_PARAMS,
  'instagram.com': ['igshid', 'igsh'],
  'twitter.com': TWITTER_TRACKING_PARAMS,
  'x.com': TWITTER_TRACKING_PARAMS,
};

export const POTENTIAL_TRACKING_PARAMS = [];

export const DOMAIN_SPECIFIC_POTENTIAL_TRACKING_PARAMS: Record<string, string[]> = {
  'linkedin.com': ['rcm', 'lipi'],
};
