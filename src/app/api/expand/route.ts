'use server';

import { NextRequest, NextResponse } from 'next/server';
// import { subtle } from 'node:crypto';
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';
import { createClient } from '@/app/_adapters/supabase/server';
// import rehypeParse from 'rehype-parse';
// import rehypeRemark from 'rehype-remark';
// import remarkStringify from 'remark-stringify';
// import { unified } from 'unified';
// TODO: url scanning
// import cloudflare from '@/app/_services/cloudflare';
// import { KNOWN_DOMAINS } from '@/constants';
import { STORAGE_REFRESH_INTERVAL } from '@/constants';

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

  let providerId;
  let snapshot;
  let screenshot;

  try {
    const { data, error } = await supabase
      .from('short_url_providers')
      .select('*')
      .eq('provider', provider)
      .single();

    if (error) {
      console.error(error);
    }

    if (!data) {
      const { data, error } = await supabase
        .from('short_url_providers')
        .insert([
          {
            provider,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(error);
      }

      if (data) {
        providerId = data.id;
      }
    } else {
      providerId = data.id;
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
      .single();

    if (error) {
      console.error(error);
    }

    if (data) {
      return new NextResponse(
        JSON.stringify({
          metadata: data.metadata,
          screenshotPath: data.screenshot,
          favicon: data.favicon,
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
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    timeout: 5000,
    userAgent,
  };

  try {
    const browser = await playwright.launch(launchOptions);

    const context = await browser.newContext();

    for (const page of await context.pages()) {
      await page.close();
    }

    const page = await context.newPage();

    await page.goto(shortUrlObj.toString());

    await page.waitForLoadState('domcontentloaded');

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

      const title = await page.title();

      metadata.push({
        title,
      });

      const language = await page.getAttribute('html', 'lang');

      if (language) {
        metadata.push({
          language,
        });
      }

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
        // prefer apple-touch-icon -> shortcut icon -> type=image/vnd.microsoft.icon -> icon
        if ((await f.getAttribute('rel')) === 'apple-touch-icon') {
          favicon = await f.getAttribute('href');
          break;
        } else if ((await f.getAttribute('rel')) === 'shortcut icon') {
          favicon = await f.getAttribute('href');
          break;
        } else if ((await f.getAttribute('rel')) === 'icon') {
          // check for [type="image/vnd.microsoft.icon"]
          const type = await f.getAttribute('type');

          if (type === 'image/vnd.microsoft.icon') {
            favicon = await f.getAttribute('href');
            break;
          }

          if (!favicon) {
            favicon = await f.getAttribute('href');
          }
        }
      }

      if (favicon) {
        favicon = new URL(favicon, urlObj.origin).toString();
      }

      const screenshotImg = await page.screenshot({ type: 'png' });

      await browser.close();

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

                return new Date(s.created_at) >= STORAGE_REFRESH_INTERVAL;
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

            finalScreenshotPath = screenshotName;

            finalScreenshotPath = finalScreenshotPath
              .split('/')
              .filter((part) => part)
              .join('/');

            supabase.storage
              .from('inspector-screenshots')
              .upload(finalScreenshotPath, screenshotImg);
          } catch (error) {
            console.error(error);
          }
        }

        screenshot = finalScreenshotPath;

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

        //         return new Date(s.created_at) >= STORAGE_REFRESH_INTERVAL;
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
          const { error } = await supabase.from('expanded_urls').insert([
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

          if (error) {
            console.error(error);
          }
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

        await browser.close();

        return new NextResponse(JSON.stringify({ metadata, favicon }), { status: 201 });
      }
    } catch (error) {
      console.error(error);

      await browser.close();

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
