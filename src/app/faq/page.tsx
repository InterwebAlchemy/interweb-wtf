import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Anchor,
  Text,
} from '@mantine/core';
import Screen from '@/app/_components/Screen';

export default function FAQPage() {
  return (
    <Screen title="Frequently Asked Questions">
      <Accordion multiple>
        <AccordionItem value="what-is-interweb-wtf">
          <AccordionControl>What is Interweb.WTF?</AccordionControl>
          <AccordionPanel>
            Interweb.WTF is a URL shortening service that allows you to create{' '}
            <Anchor href="/docs/concepts/shortlinks">shortlinks</Anchor> for your URLs.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="what-is-a-wtf-link">
          <AccordionControl>What is a WTF Link?</AccordionControl>
          <AccordionPanel>
            A WTF Link is a <Anchor href="/docs/concepts/shortlinks">shortlink</Anchor> created by
            Interweb.WTF.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="what-is-a-shortlink">
          <AccordionControl>Why do the URLs use that naming convention?</AccordionControl>
          <AccordionPanel>
            The URL slugs and short URL paths that Interweb.WTF uses result in simple, memorable,
            easy to type URLs. The URL slugs are an homage to{' '}
            <Anchor href="https://heroku.com">Heroku</Anchor> and its{' '}
            <Anchor href="https://stackoverflow.com/a/20059752/656011">naming convention</Anchor>{' '}
            for app subdomains.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="can-i-use-my-own-domain-name-with-interweb-wtf">
          <AccordionControl>Can I use my own domain name with Interweb.WTF?</AccordionControl>
          <AccordionPanel>
            <Text span inherit fw={700}>
              No.
            </Text>{' '}
            WTF Links are designed to be easily identifiable so that users know they can trust that
            a shortlink is a WTF Link and that they can expect the features and privacy that
            Interweb.WTF provides.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="can-i-customize-the-wtf-link-path">
          <AccordionControl>Can I customize the WTF Link path?</AccordionControl>
          <AccordionPanel>
            <Text span inherit fw={700}>
              No.
            </Text>{' '}
            WTF Links are designed to be transparent about the fact that they are a shortlink that
            could point to anything - and therefore cannot be implicitly trusted. Additionally, our
            slugs create WTF Links that are easily typed, easily shared, and easy to remember.
            Customizing the path would allow users to create complex WTF Link paths or use slugs
            that seem more trustworthy than they are.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="can-i-find-out-who-interacted-with-my-link">
          <AccordionControl>Can I find out who interacted with my link?</AccordionControl>
          <AccordionPanel>
            <Text span inherit fw={700}>
              No.
            </Text>{' '}
            Interweb.WTF does not track or store any information about who interacts with your links
            or allow any tracking parameters to be added to the underlying URL that a WTF Link
            points to.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Screen>
  );
}
