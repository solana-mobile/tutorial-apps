import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useAuthorization} from '../hooks/AuthorizationProvider';
import {useAppState} from '../hooks/useAppState';
import FarmImage from './FarmImage';
import GameButton from './GameButton';
import HowToPlay from './HowToPlay';

export default function EmptyFarmView() {
  const {authorizeSession} = useAuthorization();
  const [isFetching, setIsFetching] = useState(false);
  const {owner, initializeFarm} = useAppState();

  const handleDeposit = useCallback(async () => {
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
  }, [authorizeSession, initializeFarm, owner]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to your farm!</Text>
      <HowToPlay />
      <FarmImage isHarvesting={false} />
      <GameButton
        text="Deposit"
        disabled={isFetching}
        onPress={handleDeposit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: 'black', // Dark gray text color
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
