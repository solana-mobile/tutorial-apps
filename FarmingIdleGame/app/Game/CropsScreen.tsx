import {FlatList, ImageBackground, StyleSheet, View} from 'react-native';

import BalanceHeaderBar from '../../components/BalanceHeaderBar';
import CropCard from '../../components/CropCard';
import {GameState, useAppState} from '../../hooks/useAppState';
import {UPGRADES} from '../../utils/utils';

export default function CropsScreen() {
  const {farmAccount, gameState, upgradeFarm} = useAppState();
  const upgradesEnabled =
    gameState === GameState.Initialized && farmAccount !== null;

  return (
    <>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../assets/crystal_background.jpg')}>
        <View style={styles.container}>
          <BalanceHeaderBar />
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
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  list: {
    alignItems: 'center',
  },
});
