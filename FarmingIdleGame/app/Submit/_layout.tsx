import {Entypo} from '@expo/vector-icons';
import {router, Stack} from 'expo-router';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function SubmitLayout() {
  const header = (
    <TouchableOpacity
      onPress={() => {
        router.replace('/Game/SettingsScreen');
      }}
      style={styles.header}>
      <Entypo name="chevron-left" size={24} color="black" />
    </TouchableOpacity>
  );
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Submit your score',
        headerTitleAlign: 'center',
        headerLeft: _ => {
          return header;
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingRight: 12,
  },
});
