import {ActivityIndicator, StyleSheet, View} from 'react-native';

import EmptyFarmView from '../../components/EmptyFarmView';
import FarmView3 from '../../components/FarmView3';
import {GameState, useAppState} from '../../store/useAppState';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function HarvestScreen() {
  const {farmAccount, gameState} = useAppState();
  return (
    <View style={styles.container}>
      {gameState === GameState.Loading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : null}
      {gameState === GameState.Uninitialized ? <EmptyFarmView /> : null}
      {gameState === GameState.Initialized && farmAccount ? (
        <>
          <FarmView3 farmAccount={farmAccount} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
