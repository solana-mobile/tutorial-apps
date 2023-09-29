import {Text} from 'react-native';

import OnboardingModalPage from './OnboardingModalPage';

export default function OnboardingSubmit() {
  return (
    <OnboardingModalPage title="Submit your highscore">
      <Text>
        When finished, submit your highscore and reset your farm. {'\n'}
        {'\n'}
      </Text>
      <Text>
        If you score high enough, your farm appears in the global Top 5
        leaderboards!
        {'\n'}
      </Text>
    </OnboardingModalPage>
  );
}
