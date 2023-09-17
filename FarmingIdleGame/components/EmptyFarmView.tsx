import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {useAuthorization} from '../hooks/AuthorizationProvider';
import {useAppState} from '../hooks/useAppState';
import FarmImage from './FarmImage';
import GameButton from './GameButton';
import OnboardingModal from './OnboardingModal';

export default function EmptyFarmView() {
  const {authorizeSession} = useAuthorization();
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
      <View style={styles.banner}>
        <Text style={styles.header}>Deposit to initialize your farm!</Text>
      </View>
      <FarmImage isHarvesting={false} />
      <Button title="Open Onboarding" onPress={() => setModalVisible(true)} />
      <OnboardingModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <GameButton
        text="Deposit 0.001 SOL"
        disabled={isFetching}
        onPress={handleDeposit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    backgroundColor: 'rgba(1, 1, 1, 0.4)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 32,
  },
  header: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
});
