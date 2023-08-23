import {StatusBar} from 'expo-status-bar';
import {ScrollView, StyleSheet, View} from 'react-native';

import CropCard from '../../components/CropCard'; // Assuming CropCard is in the same directory

export default function CropsScreen() {
  // Sample crop data
  const crops = [
    {
      imageUri:
        'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/af/Apple_JE3_BE3.png/revision/latest?cb=20200519232834',
      description: 'Apple',
      price: 15,
      amount: 1,
    },
    {
      imageUri:
        'https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/75/Wheat_JE2_BE2.png/revision/latest?cb=20190521034232',
      description: 'Wheat',
      price: 10,
      amount: 1,
    },
    {
      imageUri:
        'https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3a/Sugar_Cane_%28item%29_JE3_BE3.png/revision/latest?cb=20210317220330',
      description: 'Sugar Cane',
      price: 10,
      amount: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {crops.map((crop, index) => (
          <CropCard key={index} {...crop} />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    alignItems: 'center',
  },
});
