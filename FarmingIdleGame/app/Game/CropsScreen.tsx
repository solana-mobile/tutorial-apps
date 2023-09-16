import {FlatList, StyleSheet, View} from 'react-native';

import CropCard from '../../components/CropCard';
import {GameState, useAppState} from '../../hooks/useAppState';
import {UPGRADES} from '../../program-utils/cropUpgrades';

export default function CropsScreen() {
  const {farmAccount, gameState, upgradeFarm} = useAppState();
  const upgradesEnabled =
    gameState === GameState.Initialized && farmAccount !== null;

  return (
    <View style={styles.container}>
      <FlatList
        data={UPGRADES}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: upgrade, index: i}) => (
          <CropCard
            upgrade={upgrade}
            upgradeIndex={i}
            farmAccount={farmAccount}
            upgradesEnabled={upgradesEnabled}
            onPurchase={async () => {
              await upgradeFarm(i, 1);
            }}
          />
        )}
        contentContainerStyle={styles.list}
      />
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
