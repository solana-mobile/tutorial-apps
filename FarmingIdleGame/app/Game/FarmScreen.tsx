import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import BalanceHeaderBar from '../../components/BalanceHeaderBar';
import EmptyFarmView from '../../components/EmptyFarmView';
import FarmView from '../../components/FarmView';
import {GameState, useAppState} from '../../hooks/useAppState';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function HarvestScreen() {
  const {farmAccount, gameState} = useAppState();
  return (
    <>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../assets/crystal_background.jpg')}>
        <View style={styles.container}>
          <BalanceHeaderBar />
          {gameState === GameState.Loading ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : null}
          {gameState === GameState.Uninitialized ? (
            <>
              <EmptyFarmView />
            </>
          ) : null}
          {gameState === GameState.Initialized && farmAccount ? (
            <>
              <FarmView farmAccount={farmAccount} />
            </>
          ) : null}
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
    borderRadius: 8,
    marginRight: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
