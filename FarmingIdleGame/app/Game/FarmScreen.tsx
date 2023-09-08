import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import FarmView3 from '../../components/FarmView3';
import GameButton from '../../components/GameButton';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {GameState, useAppState} from '../../store/useAppState';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function HarvestScreen() {
  const {authorizeSession} = useAuthorization();
  const [isFetching, setIsFetching] = useState(false);

  const {owner, initializeFarm, farmAccount, gameState} = useAppState();
  return (
    <View style={styles.container}>
      {gameState === GameState.Loading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : null}
      {gameState === GameState.Uninitialized ? (
        <GameButton
          text="Deposit"
          disabled={isFetching}
          onPress={async () => {
            setIsFetching(true);
            try {
              await transact(async wallet => {
                const authResult = await authorizeSession(wallet);
                if (authResult.publicKey.toString() !== owner?.toString()) {
                  throw Error('Incorrect wallet authorized for owner signing');
                }

                await initializeFarm(wallet);
              });
            } catch (error: any) {
              if (error instanceof Error) {
                console.error(`Failed to initialize farm: ${error.message}`);
              }
            } finally {
              setIsFetching(false);
            }
          }}
        />
      ) : null}
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
