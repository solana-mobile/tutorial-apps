import {Image, StyleSheet, Text, View} from 'react-native';

import {
  formatNumber,
  getNextCost,
  UpgradeType,
} from '../program-utils/cropUpgrades';
import {FarmAccount} from '../program-utils/farmingProgram';
import GameButton from './GameButton';

type Props = Readonly<{
  upgrade: UpgradeType;
  upgradeIndex: number;
  farmAccount: FarmAccount | null;
  upgradeEnabled: boolean;
  onPurchase: () => Promise<void>;
}>;

function CropCard({
  upgrade,
  upgradeIndex,
  farmAccount,
  upgradeEnabled,
  onPurchase,
}: Props) {
  const ownedAmount = farmAccount ? farmAccount.farmUpgrades[upgradeIndex] : 0;
  const owned: string = farmAccount
    ? formatNumber(farmAccount.farmUpgrades[upgradeIndex])
    : 'X';
  const cost: number = farmAccount
    ? getNextCost(upgrade.baseCost, farmAccount.farmUpgrades[upgradeIndex])
    : upgrade.baseCost;
  const costString = formatNumber(cost);
  const buyEnabled: boolean = farmAccount
    ? farmAccount.harvestPoints.toNumber() >= cost && upgradeEnabled
    : false;
  // const shouldShow: boolean = farmAccount
  //   ? farmAccount.farmUpgrades[upgradeIndex] > 0 || buyEnabled
  //   : false;
  return (
    <View style={styles.card}>
      <Image source={upgrade.image} style={styles.image} />
      <View style={styles.infoSection}>
        <Text style={styles.cardTitle}>
          {upgrade.name}{' '}
          <Text
            style={
              styles.cardSubtitle
            }>{` (+${upgrade.coinPerUpgrade} 🌾/sec)`}</Text>
        </Text>

        <Text style={styles.description}>Owned: {ownedAmount}</Text>
        <Text style={styles.description}>Cost: -{costString} 🌾</Text>
      </View>
      <View style={styles.divider} />
      <GameButton text={`Purchase (-${costString}🌾)`} onPress={onPurchase} />
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

export default CropCard;
