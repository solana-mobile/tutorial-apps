import {StatusBar} from 'expo-status-bar';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import CropCard from '../../components/CropCard'; // Assuming CropCard is in the same directory
import GameButton from '../../components/GameButton';
import {
  formatNumber,
  getCpS,
  getNextCost,
  UPGRADES,
} from '../../program-utils/cropUpgrades';
import {GameState, useAppState} from '../../store/useAppState';

export default function CropsScreen() {
  const {farmAccount, gameState, upgradeFarm} = useAppState();
  const upgradeEnabled = gameState === GameState.Initialized;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {UPGRADES.map((upgrade, i) => {
          const ownedAmount = farmAccount ? farmAccount.farmUpgrades[i] : 0;
          const owned: string = farmAccount
            ? formatNumber(farmAccount.farmUpgrades[i])
            : 'X';
          const cost: number = farmAccount
            ? getNextCost(upgrade.baseCost, farmAccount.farmUpgrades[i])
            : upgrade.baseCost;
          const costString = formatNumber(cost);
          const buyEnabled: boolean = farmAccount
            ? farmAccount.harvestPoints.toNumber() >= cost && upgradeEnabled
            : false;
          const shouldShow: boolean = farmAccount
            ? farmAccount.farmUpgrades[i] > 0 || buyEnabled
            : false;

          return (
            <View key={i} style={cardStyles.card}>
              <Image source={{uri: upgrade.image}} style={cardStyles.image} />
              <View style={cardStyles.infoSection}>
                <Text style={cardStyles.description}>{upgrade.name}</Text>
                <Text style={cardStyles.price}>Price: ${costString}</Text>
                <Text style={cardStyles.amount}>Owned: {owned}</Text>
                <Text style={cardStyles.amount}>
                  Yield per Second: {ownedAmount * upgrade.coinPerUpgrade}
                </Text>
                <GameButton
                  text="Purchase"
                  onPress={async () => {
                    await upgradeFarm(i, 1);
                  }}
                />
              </View>
            </View>
          );
        })}
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

const cardStyles = StyleSheet.create({
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
