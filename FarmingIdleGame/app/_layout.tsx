import {Slot} from 'expo-router';

import {AuthorizationProvider} from '../storage/AuthorizationProvider';

export default function ConnectLayout() {
  return (
    <AuthorizationProvider>
      <Slot />
    </AuthorizationProvider>
  );
}
