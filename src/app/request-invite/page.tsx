import PrivateBeta from '@/app/_components/PrivateBeta';
import Screen from '@/app/_components/Screen';

export const metadata = {
  title: 'Request Invite',
  description: 'Request an invite to Interweb.WTF',
};

export default function RequestInvitePage() {
  return (
    <Screen>
      <PrivateBeta />
    </Screen>
  );
}
