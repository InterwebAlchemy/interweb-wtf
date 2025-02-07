'use server';

import { NextRequest, NextResponse } from 'next/server';
// import { subtle } from 'node:crypto';
import { chromium } from 'playwright';
// import rehypeParse from 'rehype-parse';
// import rehypeRemark from 'rehype-remark';
// import remarkStringify from 'remark-stringify';
// import { unified } from 'unified';
// TODO: url scanning
// import cloudflare from '@/app/_services/cloudflare';
// import { KNOWN_DOMAINS } from '@/app/constants';

import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  url: string;
  userAgent: string;
  shortUrl: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url, shortUrl, userAgent } = requestObj;

  const urlObj = new URL(url);

  const shortUrlObj = new URL(shortUrl);

  const provider = shortUrlObj.hostname;

  const supabase = await createClient();

  // refresh after 2 weeks
  const storageRefreshInterval = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  let providerId;
  let snapshot;
  let screenshot;

  try {
    const { data, error } = await supabase
      .from('short_url_providers')
      .select('*')
      .eq('provider', provider)
      .limit(1);

    if (error) {
      console.error(error);
    }

    console.log(data, provider);

    if (!data || data.length === 0) {
      const { data, error } = await supabase
        .from('short_url_providers')
        .insert([
          {
            provider,
          },
        ])
        .select();

      if (error) {
        console.error(error);
      }

      if (data) {
        providerId = data[0].id;
      }
    } else {
      providerId = data[0].id;
    }
  } catch (error) {
    console.error(error);
  }

  // check for url info in expanded_urls table
  try {
    const { data, error } = await supabase
      .from('expanded_urls')
      .select('*')
      .eq('short_url', shortUrlObj.toString())
      .limit(1);

    if (error) {
      console.error(error);
    }

    if (data && data.length > 0) {
      return new NextResponse(
        JSON.stringify({
          metadata: data[0].metadata,
          screenshotPath: data[0].screenshot,
          favicon: data[0].favicon,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }

  // scrape url with playwright
  const launchOptions = {
    headless: true,
    chromiumSandbox: true,
    env: {},
    timeout: 5000,
    userAgent,
  };

  try {
    const browser = await chromium.launch(launchOptions);

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto(shortUrlObj.toString());

    await page.waitForLoadState('load');

    // TODO: check for interstitial pages with actual URL and click on the links if necessary
    // then send updated URL info to the client
    // Example: https://lnkd.in/eX5KYRRg -> interstial page with link in a[data-tracking-control-name="external_url_click"]
    // const externalUrl = await page
    //   .locator('[data-tracking-control-name="external_url_click"]')
    //   .all();

    // if (typeof externalUrl?.[0] !== 'undefined') {
    //   try {
    //     await externalUrl[0].click();

    //     await page.waitForLoadState('load');
    //   } catch (error) {
    //     console.error("Error: Could not click on interstitial page's external URL");
    //     console.error(error);
    //   }
    // }

    try {
      const meta = await page.locator('meta');

      const metadata = [];

      for (const m of await meta.all()) {
        if (await m.getAttribute('charset')) {
          metadata.push({
            charset: await m.getAttribute('charset'),
          });
        } else if (await m.getAttribute('name')) {
          metadata.push({
            name: await m.getAttribute('name'),
            content: await m.getAttribute('content'),
          });
        } else if (await m.getAttribute('property')) {
          metadata.push({
            property: await m.getAttribute('property'),
            content: await m.getAttribute('content'),
          });
        }
      }

      const faviconElements = await page.locator('link[rel~="icon"]');

      let favicon;

      for (const f of await faviconElements.all()) {
        // prefer apple-touch-icon -> icon -> shortcut icon
        if ((await f.getAttribute('rel')) === 'apple-touch-icon') {
          favicon = await f.getAttribute('href');
          break;
        } else if ((await f.getAttribute('rel')) === 'icon') {
          favicon = await f.getAttribute('href');
        } else if ((await f.getAttribute('rel')) === 'shortcut icon' && !favicon) {
          favicon = await f.getAttribute('href');
        }
      }

      try {
        let finalScreenshotPath;

        const screenshotPath = `screenshots/${urlObj.hostname}${urlObj.pathname}/`;

        // check if recent screenshot already exists
        const { data, error } = await supabase.storage
          .from('inspector-screenshots')
          .list(screenshotPath);

        if (error) {
          console.error(error);
        }

        if (typeof data !== 'undefined' && data !== null && data.length > 0) {
          if ((data.length === 1 && data[0].name.includes('.png')) || data.length > 1) {
            // check for timestamp within the last 3 days
            finalScreenshotPath = `${screenshotPath}/${
              data.find((s) => {
                if (!s.name.includes('.png')) {
                  return false;
                }

                return new Date(s.created_at) >= storageRefreshInterval;
              })?.name
            }`;

            finalScreenshotPath = finalScreenshotPath
              .split('/')
              .filter((part) => part)
              .join('/');
          }
        }

        if (!finalScreenshotPath) {
          try {
            const screenshotName = `${screenshotPath}/${new Date().toISOString()}.png`;

            const screenshotImg = await page.screenshot({ type: 'png' });

            finalScreenshotPath = screenshotName;

            finalScreenshotPath = finalScreenshotPath
              .split('/')
              .filter((part) => part)
              .join('/');

            screenshot = finalScreenshotPath;

            supabase.storage
              .from('inspector-screenshots')
              .upload(finalScreenshotPath, screenshotImg);
          } catch (error) {
            console.error(error);
          }
        }

        // try {
        //   let finalSnapshotPath;

        //   // adapted from: https://www.slingacademy.com/article/implement-secure-hashing-and-random-values-in-javascript-web-crypto/
        //   const snapshotHash = await subtle.digest(
        //     'SHA-256',
        //     new TextEncoder().encode(`${urlObj.hostname}${urlObj.pathname}`)
        //   );

        //   const snapshotHashArray = Array.from(new Uint8Array(snapshotHash));

        //   const snapshotHashName = `snapshots/${snapshotHashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')}.md`;

        //   // check for existing recent snapshot in snapshot storage bucket
        //   const { data, error } = await supabase.storage.from('snapshots').list(snapshotHashName);

        //   if (error) {
        //     console.error(error);
        //   }

        //   // check for recent snapshot within the last 7 days
        //   if (typeof data !== 'undefined' && data !== null && data.length > 0) {
        //     if ((data.length === 1 && data[0].name.includes('.md')) || data.length > 1) {
        //       finalSnapshotPath = data.find((s) => {
        //         if (!s.name.includes('.md')) {
        //           return false;
        //         }

        //         return new Date(s.created_at) >= storageRefreshInterval;
        //       })?.name;
        //     }
        //   }

        //   // TODO: generate snapshot if not found
        //   if (!finalSnapshotPath) {
        //     try {
        //       // TODO: summarize actual content with LLM
        //       let body = await page.locator('body');

        //       // use the <main> element if it exists
        //       const main = await page.locator('main').all();

        //       if (main.length > 0) {
        //         body = main[0];
        //       }

        //       const bodyContent = await body.innerHTML();

        //       // Convert body HTML to Markdown for summarization via LLM
        //       const content = await unified()
        //         .use(rehypeParse)
        //         .use(rehypeRemark)
        //         .use(remarkStringify)
        //         .process(bodyContent);

        //       finalSnapshotPath = snapshotHashName;

        //       finalSnapshotPath = finalSnapshotPath
        //         .split('/')
        //         .filter((part) => part)
        //         .join('/');

        //       snapshot = finalSnapshotPath;

        //       await supabase.storage.from('snapshots').upload(snapshotHashName, content.toString());
        //     } catch (error) {
        //       console.error(error);
        //     }
        //   }
        // } catch (error) {
        //   console.error(error);
        // }

        try {
          await supabase.from('expanded_urls').insert([
            {
              expanded_url: urlObj.toString(),
              short_url: shortUrlObj.toString(),
              provider_id: providerId,
              metadata,
              favicon,
              snapshot,
              screenshot,
            },
          ]);
        } catch (error) {
          console.error(error);
        }

        return new NextResponse(
          JSON.stringify({ metadata, screenshotPath: finalScreenshotPath, favicon }),
          {
            status: 201,
          }
        );
      } catch (error) {
        console.error(error);

        return new NextResponse(JSON.stringify({ metadata, favicon }), { status: 201 });
      }
    } catch (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not scrape URL' }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify({ message: 'Server error starting scraper' }), {
      status: 500,
    });
  }
}
