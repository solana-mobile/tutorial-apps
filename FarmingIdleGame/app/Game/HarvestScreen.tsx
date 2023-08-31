import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import FarmAccountInfo from '../../components/FarmAccountInfo';
import FarmView from '../../components/FarmView';
import GameButton from '../../components/GameButton';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {getCpS} from '../../program-utils/cropUpgrades';
import {useAppState} from '../../store/useAppState';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function HarvestScreen() {
  const {authorizeSession} = useAuthorization();
  const [isFetching, setIsFetching] = useState(false);

  const {owner, farmAccount, initializeFarm, harvestFarm} = useAppState();

  return (
    <View style={styles.container}>
      <Text>In Harvest Screen</Text>

      {farmAccount ? (
        <>
          <FarmView />
          <FarmAccountInfo farmAccount={farmAccount} />
          <GameButton
            text="Harvest!"
            disabled={isFetching}
            onPress={async () => {
              setIsFetching(true);
              try {
                await harvestFarm();
              } catch (error: any) {
                if (error instanceof Error) {
                  console.error(`Failed to harvest: ${error.message}`);
                }
              } finally {
                setIsFetching(false);
              }
            }}
          />
        </>
      ) : (
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
      )}
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
