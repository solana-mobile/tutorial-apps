import {Slot} from 'expo-router';

import {AuthorizationProvider} from '../hooks/AuthorizationProvider';

export default function ConnectLayout() {
  return (
    <AuthorizationProvider>
      <Slot />
    </AuthorizationProvider>
  );
}
