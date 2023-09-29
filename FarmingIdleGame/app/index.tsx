import {clusterApiUrl, Connection} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useCallback, useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

import GameButton from '../components/GameButton';
import {useAuthorization} from '../hooks/AuthorizationProvider';
import {useAppState} from '../hooks/useAppState';
export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function ConnectScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const {authorizeSession, selectedAccount, isFetchingAuthorization} =
    useAuthorization();
  const {onConnect} = useAppState();

  useEffect(() => {
    async function prepare() {
      try {
        if (!isFetchingAuthorization && selectedAccount) {
          // If we are done fetching auth and we *do* have cached auth,
          // then pre-fetch resources, hide splash, then go to game screen
          await onConnect(
            selectedAccount.publicKey,
            new Connection(clusterApiUrl('devnet'), 'processed'),
          );
          setAppIsReady(true);
          router.replace('Game/FarmScreen');
        } else if (!isFetchingAuthorization && !selectedAccount) {
          // If we are done fetching auth and we *don't*  have cached auth,
          // hide splash, show connect button
          setAppIsReady(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
    prepare();
  }, [onConnect, selectedAccount, isFetchingAuthorization]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/image_1024.png')}>
        <View style={styles.content}>
          <Text style={styles.header}>Solana Idle Farming Game</Text>
          <View style={styles.playButton}>
            <GameButton
              onPress={async () => {
                await transact(async wallet => {
                  await authorizeSession(wallet);
                });
              }}
              text="Connect"
            />
          </View>
        </View>

        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    paddingBottom: 24,
  },
  header: {
    paddingTop: '20%',
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 12,
  },
});
