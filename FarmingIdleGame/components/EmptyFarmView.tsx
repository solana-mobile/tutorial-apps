import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useAuthorization} from '../hooks/AuthorizationProvider';
import {useAppState} from '../store/useAppState';
import GameButton from './GameButton';
import FarmImage from './FarmImage';

type EmptyFarmViewProps = {
  // Any other prop types you might need
};

export default function EmptyFarmView({}: EmptyFarmViewProps) {
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
      <Text style={styles.instructionText}>
        Welcome to the Solana Mobile Farming Idle Game
      </Text>
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
  },
  instructionText: {
    fontSize: 18,
    color: '#333', // Dark gray text color
    textAlign: 'left',
    marginBottom: 20,
  },
});
