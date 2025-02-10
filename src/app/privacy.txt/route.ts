import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
# Privacy Policy

When you create an account, you grant Interweb.WTF access to your GitHub username and email address.

We never share this information with any third parties.

We use this information to identify you when you log in and may occasionally send you critical notifications about the Interweb.WTF service or your account, but we rarely send any correspondence.

If you choose to \`Skip the Inspector Interstitial\`, when you access a WTF Link, we will store a single cookie on your device to remember your preference for the current browser. We only use this cookie to determine whether to show you the WTF Link Inspector or direct you automatically to the destination of a the WTF Link. You can always append \`/info\` to any WTF Link to view the Inspector for that WTF Link.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
