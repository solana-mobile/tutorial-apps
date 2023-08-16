import { Tabs } from 'expo-router/tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }

export default function GameLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        // Name of the route to hide.
        name="HarvestScreen"
        options={{
            title: 'Harvest',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="CropsScreen"
        options={{
            title: 'Crops',
            tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="SettingsScreen"
        options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}