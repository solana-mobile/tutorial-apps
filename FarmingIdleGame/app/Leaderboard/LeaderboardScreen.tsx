import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useState} from 'react';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GameButton from '../../components/GameButton';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';
import {
  getFarmingGameProgram,
  getInitializeLeaderBoardIx,
  signSendAndConfirmOwnerIx,
} from '../../program-utils/farmingProgram';
import {truncatePublicKey} from '../../program-utils/utils';

type LeaderboardEntryProps = Readonly<{
  rankColText: string;
  addressColText: string;
  pointsColText: string;
  isHeader: boolean;
}>;

function LeaderboardEntry({
  rankColText,
  addressColText,
  pointsColText,
  isHeader,
}: LeaderboardEntryProps) {
  return (
    <View style={styles.tableRow}>
      <Text
        style={[
          isHeader ? styles.headerCell : styles.entryCell,
          styles.rankCell,
        ]}>
        {rankColText}
      </Text>
      <Text
        style={[
          isHeader ? styles.headerCell : styles.entryCell,
          styles.addressCell,
        ]}>
        {addressColText}
      </Text>
      <Text
        style={[
          isHeader ? styles.headerCell : styles.entryCell,
          styles.pointsCell,
        ]}>
        {pointsColText}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const {authorizeSession} = useAuthorization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    owner,
    connection,
    farmAccount,
    playerKeypair,
    leaderboardEntries,
    submitLeaderboard,
    refreshLeaderboard,
    refreshFarmAccount,
  } = useAppState();

  const handleSubmitPress = useCallback(async () => {
    if (!connection || !owner || !playerKeypair) {
      return;
    }
    setIsSubmitting(true);
    try {
      await transact(async wallet => {
        await authorizeSession(wallet);
        await submitLeaderboard(wallet);
      });

      // Refresh local state after submission
      refreshLeaderboard();
      refreshFarmAccount();
    } catch (e) {
      console.error('Error trying to submit high score: ' + e);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    authorizeSession,
    connection,
    owner,
    playerKeypair,
    refreshFarmAccount,
    refreshLeaderboard,
    submitLeaderboard,
  ]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>🏆 All Time</Text>
        <LeaderboardEntry
          key={'header'}
          isHeader={true}
          rankColText="Rank"
          addressColText="Address"
          pointsColText="Harvest Points"
        />
        {leaderboardEntries !== null &&
          leaderboardEntries.map((leaderboardEntry, index) => {
            return (
              <React.Fragment key={index}>
                <View style={styles.divider} />
                <LeaderboardEntry
                  isHeader={false}
                  rankColText={String(index + 1)}
                  addressColText={truncatePublicKey(
                    leaderboardEntry.wallet.toBase58(),
                  )}
                  pointsColText={leaderboardEntry.points.toString()}
                />
              </React.Fragment>
            );
          })}

        {owner && (
          <>
            <View style={styles.divider} />
            <LeaderboardEntry
              isHeader={false}
              rankColText={'You'}
              addressColText={truncatePublicKey(owner.toBase58())}
              pointsColText={farmAccount?.harvestPoints.toString() ?? '0'}
            />
          </>
        )}
      </View>
      {leaderboardEntries && (
        <View style={styles.submitButton}>
          <GameButton
            disabled={!farmAccount || !connection || isSubmitting}
            text="🏆 Submit your score 🏆"
            onPress={handleSubmitPress}
          />
        </View>
      )}
      {
        // If leaderboard account has not been globally initialized
        !leaderboardEntries ? (
          <View style={styles.initButton}>
            <GameButton
              text={'Initialize Leaderboard'}
              onPress={async () => {
                console.log('In press');

                const farmProgram = getFarmingGameProgram(connection!);
                console.log('Pre transact');

                await transact(async wallet => {
                  console.log('In transact');
                  await authorizeSession(wallet);

                  const initLeaderboardIx = await getInitializeLeaderBoardIx(
                    farmProgram,
                    owner!,
                  );

                  await signSendAndConfirmOwnerIx(
                    connection!,
                    wallet,
                    owner!,
                    initLeaderboardIx,
                  );
                });
              }}
            />
          </View>
        ) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  headerCell: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  entryCell: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444444',
  },
  rankCell: {
    flexBasis: '20%',
  },
  addressCell: {
    flexBasis: '40%',
  },
  pointsCell: {
    flexBasis: '40%',
    textAlign: 'right',
  },
  initButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: 'rgba(111, 111, 111, 0.5)',
  },
  submitButton: {
    alignSelf: 'center',
    paddingVertical: 32,
  },
});
