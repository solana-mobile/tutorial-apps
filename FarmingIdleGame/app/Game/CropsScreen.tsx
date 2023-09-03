import {ScrollView, StyleSheet, View} from 'react-native';

import CropCard from '../../components/CropCard';
import {UPGRADES} from '../../program-utils/cropUpgrades';
import {GameState, useAppState} from '../../store/useAppState';
import CropCard2 from '../../components/CropCard2';

export default function CropsScreen() {
  const {farmAccount, gameState, upgradeFarm} = useAppState();
  const upgradeEnabled = gameState === GameState.Initialized && !farmAccount;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {UPGRADES.map((upgrade, i) => {
          return (
            <CropCard2
              key={i}
              upgrade={upgrade}
              upgradeIndex={i}
              farmAccount={farmAccount}
              upgradeEnabled={upgradeEnabled}
              onPurchase={async () => {
                await upgradeFarm(i, 1);
              }}
            />
          );
        })}
      </ScrollView>
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

const cardStyles = StyleSheet.create({
  card: {
    width: 350,
    padding: 20,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  divider: {
    height: 1, // or 2 if you want a thicker line
    backgroundColor: 'black', // change this to any color you like
    marginVertical: 20, // to give some spacing above and below the line
    marginLeft: -20, // Assuming the card's padding is 20
    marginRight: -20, // Assuming the card's padding is 20
  },
  name: {
    fontSize: 16,
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
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: '400',
  },
});
