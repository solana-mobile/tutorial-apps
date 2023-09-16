import {ImageBackground, StyleSheet, Text, View} from 'react-native';

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
  upgradesEnabled: boolean;
  onPurchase: () => Promise<void>;
}>;

function CropCard({
  upgrade,
  upgradeIndex,
  farmAccount,
  upgradesEnabled,
  onPurchase,
}: Props) {
  const owned: string = farmAccount
    ? formatNumber(farmAccount.farmUpgrades[upgradeIndex])
    : '0';
  const cost: number = farmAccount
    ? getNextCost(upgrade.baseCost, farmAccount.farmUpgrades[upgradeIndex])
    : upgrade.baseCost;
  const costString = formatNumber(cost);
  const buyEnabled: boolean = farmAccount
    ? farmAccount.harvestPoints.toNumber() >= cost && upgradesEnabled
    : false;
  const shouldShowActive: boolean =
    farmAccount !== null &&
    (buyEnabled || farmAccount.farmUpgrades[upgradeIndex] > 0);

  return (
    <ImageBackground
      source={upgrade.image}
      style={styles.card}
      blurRadius={2}
      resizeMode="cover">
      <View
        style={shouldShowActive ? styles.overlay : styles.darkenedOverlay}
      />
      <View style={styles.infoSection}>
        <Text style={styles.cardTitle}>{upgrade.name} </Text>
        <Text style={styles.description}>
          Yield: {` (+${upgrade.coinPerUpgrade} 🌾/sec)`}
        </Text>
        <Text style={styles.description}>Owned: {owned}</Text>
        <Text style={styles.description}>Cost: -{costString} 🌾</Text>
      </View>
      <GameButton
        text={`Purchase (-${costString}🌾)`}
        onPress={onPurchase}
        disabled={!buyEnabled}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    padding: 20,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  darkenedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  infoSection: {
    marginBottom: 24,
  },
  divider: {
    height: 1, // or 2 if you want a thicker line
    backgroundColor: 'black', // change this to any color you like
    marginVertical: 20, // to give some spacing above and below the line
    marginLeft: -20, // Assuming the card's padding is 20
    marginRight: -20, // Assuming the card's padding is 20
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
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
    color: 'white',
  },
  description: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: '400',
  },
});

export default CropCard;
