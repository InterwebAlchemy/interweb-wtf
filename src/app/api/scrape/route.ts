'use server';

import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
// TODO: summarize actual content with LLM
// import { unified } from 'unified';
// import rehypeParse from 'rehype-parse';
// import rehypeRemark from 'rehype-remark';
// import remarkStringify from 'remark-stringify';

// TODO: url scanning
// import cloudflare from '@/app/_services/cloudflare';
// import { KNOWN_DOMAINS } from '@/app/constants';

import { createClient } from '@/app/_adapters/supabase/server';

export interface RequestProps {
  url: string;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  const requestObj: RequestProps = await request.json();

  const { url, userAgent } = requestObj;

  const urlObj = new URL(url);

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

    await page.goto(urlObj.toString());

    await page.waitForLoadState('load');

    // TODO: check for interstitial pages with actual URL and click on the links if necessary
    // then send updated URL info to the client
    // Example: https://lnkd.in/eX5KYRRg
    // const externalUrl = await page.locator('[data-tracking-control-name="external_url_click"]');
    // if (externalUrl) {
    //   await externalUrl.click();
    // }

    try {
      // const html = await page.content();

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

      const favicon = await page.locator('link[rel~="icon"]');

      const favicons = [];

      for (const f of await favicon.all()) {
        favicons.push(await f.getAttribute('href'));
      }

      try {
        let finalScreenshotPath;

        const screenshotPath = `screenshots/${urlObj.hostname}${urlObj.pathname}/`;

        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

        const supabase = await createClient();

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

                return new Date(s.created_at) >= threeDaysAgo;
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

            const screenshot = await page.screenshot({ type: 'png' });

            finalScreenshotPath = screenshotName;

            finalScreenshotPath = finalScreenshotPath
              .split('/')
              .filter((part) => part)
              .join('/');

            // upload screenshot to supabase storage bucket
            const supabase = await createClient();

            supabase.storage.from('inspector-screenshots').upload(finalScreenshotPath, screenshot);
          } catch (error) {
            console.error(error);
          }
        }

        // TODO: summarize actual content with LLM
        // try {
        //   const body = await page.locator('body');

        //   const bodyContent = await body.innerHTML();

        //   // Convert body HTML to Markdown for summarization via LLM
        //   const content = await unified()
        //     .use(rehypeParse)
        //     .use(rehypeRemark)
        //     .use(remarkStringify)
        //     .process(bodyContent);

        //   console.log(content);
        // } catch (error) {
        //   console.error(error);
        // }

        return new NextResponse(
          JSON.stringify({ metadata, screenshotPath: finalScreenshotPath, favicons }),
          {
            status: 201,
          }
        );
      } catch (error) {
        console.error(error);

        return new NextResponse(JSON.stringify({ metadata, favicons }), { status: 201 });
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
