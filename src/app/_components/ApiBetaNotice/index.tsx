import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';

export default function ApiBetaNotice(): React.ReactElement {
  return (
    <Alert icon={<IconInfoCircle />} color="teal">
      The Interweb.WTF API is currently in beta and subject to change.
    </Alert>
  );
}
