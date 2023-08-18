import {Slot} from 'expo-router';

import {AuthorizationProvider} from '../authorization/AuthorizationProvider';

export default function ConnectLayout() {
  return (
    <AuthorizationProvider>
      <Slot />
    </AuthorizationProvider>
  );
}
