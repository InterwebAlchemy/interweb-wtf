import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import playwright from 'playwright';
import { chromium as playwrightCore } from 'playwright-core';
// TODO: enable stealth
// import { chromium } from 'playwright-extra';
// import stealth from 'puppeteer-extra-plugin-stealth';=
import { createClient } from '@/app/_adapters/supabase/server';
import { generateSlug } from '@/app/_services/url';
import { removeTrackingParams } from '@/app/_utils/url';
import { getPageDescription, getPageTitle } from '@/app/_utils/webpage';
import { STORAGE_REFRESH_INTERVAL } from '@/constants';

// TODO: url scanning
// import cloudflare from '@/app/_services/cloudflare';
// import { KNOWN_DOMAINS } from '@/app/constants';

export interface RequestProps {
  url: string;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url, userAgent } = requestObj;

  const urlObj = removeTrackingParams(new URL(url));

  const supabase = await createClient();

  let slug;
  let storedUrl;

  let existingSlug = true;
  let wasRestored = false;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(error);

      return new NextResponse(JSON.stringify({ message: 'Could not find user' }), {
        status: 401,
      });
    }

    // check for existing short URL that was deleted
    const { data: deletedData, error: deletedError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('created_by', user?.id)
      .eq('url', urlObj.toString())
      .eq('deleted', true)
      .single();

    if (deletedError) {
      console.error(deletedError);
    }

    if (typeof deletedData !== 'undefined' && deletedData !== null) {
      try {
        // restore deleted short URL
        const { data: restoredData, error: restoredError } = await supabase
          .from('short_urls')
          .update({ deleted: false })
          .eq('id', deletedData.id)
          .select()
          .single();

        if (restoredError) {
          console.error(restoredError);

          return new NextResponse(
            JSON.stringify({ message: 'Could not restore previoulsy deleted WTF Link' }),
            { status: 500 }
          );
        }

        if (typeof restoredData !== 'undefined' && restoredData !== null) {
          storedUrl = restoredData;
          slug = storedUrl.slug;
          existingSlug = false;
          wasRestored = true;
        }
      } catch (error) {
        console.error(error);

        return new NextResponse(
          JSON.stringify({ message: 'Could not restore previously deleted WTF Link' }),
          { status: 500 }
        );
      }
    }

    try {
      // generate a unique slug
      while (existingSlug) {
        slug = generateSlug();

        const { data, error } = await supabase
          .from('short_urls')
          .select('slug')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error(error);
        }

        if (typeof data === 'undefined' || data === null) {
          existingSlug = false;
        }
      }

      try {
        if (!wasRestored) {
          const { data } = await supabase
            .from('short_urls')
            .insert({
              url: urlObj.toString(),
              slug,
              created_by: user?.id,
              pending: true,
              provider_id: 1,
            })
            .select()
            .single();

          storedUrl = data;
        }

        let snapshot;
        let screenshot;

        // TODO: Add scanning for malicious domains
        // if (!KNOWN_DOMAINS.includes(urlObj.hostname.split('.').slice(-2).join('.'))) {
        //   try {
        //     // scan the URL
        //     const scan = await cloudflare.urlScanner.scans.create({
        //       account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
        //       url: urlObj.toString(),
        //     });

        //     console.log('SCAN:', scan);

        //     // store the scan results in the database
        //     await supabase.from('url_reports').insert({
        //       url_id: storedUrl?.data?.[0]?.id,
        //       cloudflare_scan_results: scan,
        //     });
        //   } catch (error) {
        //     console.error(error);

        //     return new NextResponse(JSON.stringify({ message: 'Failed to scan URL' }), { status: 500 });
        //   }
        // } else {
        //   // TODO: trigger scrape/preview snapshot retrieval
        // }

        // scrape url with playwright
        const launchOptions = {
          args: chromium.args,
          executablePath:
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
              ? await chromium.executablePath()
              : playwright.chromium.executablePath(),
          headless: true,
          timeout: 5000,
          userAgent,
        };

        try {
          // TODO: enable stealth
          // chromium.use(stealth());

          const browser = await playwrightCore.launch(launchOptions);
          const context = await browser.newContext();

          for (const page of await context.pages()) {
            await page.close();
          }

          const page = await context.newPage();

          await page.goto(urlObj.toString());

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
                await supabase.from('url_info').upsert({
                  url_id: storedUrl?.id,
                  title: getPageTitle(metadata),
                  description: getPageDescription(metadata),
                  snapshot,
                  metadata,
                  screenshot,
                  favicon,
                });
              } catch (error) {
                console.error(error);
              }

              return new NextResponse(JSON.stringify({ ...storedUrl }), {
                status: 201,
              });
            } catch (error) {
              console.error(error);

              await browser.close();

              return new NextResponse(JSON.stringify({ ...storedUrl }), { status: 201 });
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
      } catch (error) {
        console.error(error);

        return new NextResponse(JSON.stringify({ message: 'Could not connect to database' }), {
          status: 500,
        });
      }
    } catch (error) {
      console.error(error);

      return new NextResponse(
        JSON.stringify({ message: 'Could not create unique short url slug' }),
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify({ message: 'Could not connect to database' }), {
      status: 500,
    });
  }
}
