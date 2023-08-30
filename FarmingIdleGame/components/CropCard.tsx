import {Image, StyleSheet, Text, View} from 'react-native';
import GameButton from './GameButton';

type Props = Readonly<{
  imageUri: string;
  description: string;
  price: number;
  amount: number;
}>;

function CropCard({imageUri, description, price, amount}: Props) {
  return (
    <View style={styles.card}>
      <Image source={{uri: imageUri}} style={styles.image} />
      <View style={styles.infoSection}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>Price: ${price}</Text>
        <Text style={styles.amount}>Owned: {amount}</Text>
        <GameButton
          text="Purchase"
          onPress={() => {
            /* Add Purchase Logic Here */
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    padding: 20,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  infoSection: {
    flex: 1,
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CropCard;
