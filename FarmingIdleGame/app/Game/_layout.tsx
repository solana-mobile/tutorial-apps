import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs} from 'expo-router/tabs';
import {useState} from 'react';

import HowToCrops from '../../components/HowToCrops';
import HowToPlay from '../../components/HowToPlay';
import NavBarInfoButton from '../../components/NavBarInfoButton';
import OnboardingModal from '../../components/OnboardingModal';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function GameLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <OnboardingModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Tabs>
        <Tabs.Screen
          name="FarmScreen"
          options={{
            title: 'Farm',
            tabBarIcon: ({color}) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <NavBarInfoButton
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="CropsScreen"
          options={{
            title: 'Crops',
            tabBarIcon: ({color}) => (
              <TabBarIcon name="plus-circle" color={color} />
            ),
            headerRight: () => (
              <NavBarInfoButton
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="SettingsScreen"
          options={{
            title: 'Settings',
            tabBarIcon: ({color}) => <TabBarIcon name="gear" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
