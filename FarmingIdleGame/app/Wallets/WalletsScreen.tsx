import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import GameButton from '../../components/GameButton';
import InfoCard from '../../components/InfoCard';
import SettingsButton from '../../components/SettingsButton';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';
import {
  getDepositIx,
  signSendAndConfirmBurnerIx,
  signSendAndConfirmOwnerBurnerIx,
  signSendAndConfirmOwnerIx,
} from '../../program-utils/farmingProgram';

function truncatePublicKey(pubKeyString: string) {
  return `${pubKeyString.slice(0, 5)}...${pubKeyString.slice(
    pubKeyString.length - 5,
    pubKeyString.length,
  )}`;
}

function bs64To58(bs64String: string) {
  const bytes = Buffer.from(bs64String, 'base64');
  return new PublicKey(bytes).toBase58();
}

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 5}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  );
}

export default function WalletsScreen() {
  const {selectedAccount, authorizeSession, deauthorizeSession} =
    useAuthorization();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    connection,
    owner,
    playerKeypair,
    ownerBalance,
    playerBalance,
    withdrawPlayerBalance,
    resetPlayer,
    clearAppState,
  } = useAppState();

  const handleDisconnectPress = async () => {
    await transact(async wallet => {
      await deauthorizeSession(wallet);
    });
    await clearAppState();
    router.replace('/');
  };

  const handleWithdrawPress = async () => {
    if (!selectedAccount || !playerKeypair) {
      throw new Error('Wallet is not initialized');
    }
    setIsLoading(true);
    try {
      await transact(async wallet => {
        const authResult = await authorizeSession(wallet);
        if (authResult.publicKey.toString() !== owner?.toString()) {
          throw Error('Incorrect wallet authorized for owner signing');
        }

        await withdrawPlayerBalance(wallet);
      });
    } catch (error: any) {
      console.error('Failed to withdraw farm balance');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPlayerPress = async () => {
    setIsLoading(true);
    try {
      await resetPlayer();
    } catch (error: any) {
      console.error('Failed to reset player');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositPress = async () => {
    if (!owner || !playerKeypair || !connection) {
      return;
    }

    setIsLoading(true);
    try {
      const depositIx = getDepositIx(owner, playerKeypair.publicKey);
      await transact(async wallet => {
        await authorizeSession(wallet);
        await signSendAndConfirmOwnerIx(connection, wallet, owner, depositIx);
      });
    } catch (error: any) {
      console.error('Failed to deposit funds into player wallet');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.centeredView}>
            <Text style={styles.modalTitle}>Reset Player Wallet</Text>
            <Text style={styles.modalBody}>
              This action will replace the current burner wallet stored locally
              on your device.
              {'\n'}
              {'\n'}
              Any existing funds will be lost!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  console.log('hi');
                  setIsModalVisible(false);
                }}>
                <View style={{backgroundColor: 'red'}}>
                  <Text>Close</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('hi');
                  setIsModalVisible(false);
                }}>
                <View style={{backgroundColor: 'red'}}>
                  <Text>Reset</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <InfoCard
          title="Main Wallet"
          subtitle={
            selectedAccount
              ? truncatePublicKey(bs64To58(selectedAccount.address))
              : null
          }>
          <Text style={styles.cardBalance}>
            {ownerBalance ? convertLamportsToSOL(ownerBalance) : 0} SOL
          </Text>
        </InfoCard>
        <View style={styles.optionRow}>
          <SettingsButton
            title="Disconnect main wallet"
            onPress={handleDisconnectPress}
          />
        </View>
        <View style={styles.divider} />

        <InfoCard
          title="Player Wallet"
          subtitle={
            playerKeypair
              ? truncatePublicKey(playerKeypair.publicKey.toBase58())
              : null
          }>
          <Text style={styles.cardBalance}>
            {playerBalance ? convertLamportsToSOL(playerBalance) : 0} SOL
          </Text>
        </InfoCard>
        <View style={styles.optionsSection}>
          <View style={styles.optionRow}>
            <SettingsButton
              title="Withdraw funds"
              onPress={handleWithdrawPress}
            />
            <View style={styles.buttonSpacer} />
            <SettingsButton
              title="Deposit funds"
              onPress={handleDepositPress}
            />
          </View>
          <View style={styles.optionRow}>
            <SettingsButton
              title="Reset player wallet"
              textColor="white"
              backgroundColor="#FC3D39"
              onPress={() => {
                setIsModalVisible(true);
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  sectionHeader: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  optionsSection: {
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 18,
  },
  divider: {
    borderWidth: 1,
    borderColor: 'rgba(111, 111, 111, 0.2)',
    marginTop: 24,
    marginBottom: 12,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSpacer: {
    paddingHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
  },
  centeredView: {
    width: '100%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  modalBody: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'justify',
  },
  modalButtons: {
    flexDirection: 'row',
  },
});
