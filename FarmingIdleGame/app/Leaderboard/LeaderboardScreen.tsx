import {PublicKey} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GameButton from '../../components/GameButton';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';
import {
  fetchLeaderboardAccount,
  getFarmingGameProgram,
  getInitializeLeaderBoardIx,
  getLeaderboardPDA,
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

type LeaderboardEntryData = Readonly<{
  wallet: PublicKey;
  points: number;
}>;

export default function LeaderboardScreen() {
  const {authorizeSession} = useAuthorization();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<Array<LeaderboardEntryData>>([]);
  const {owner, connection, farmAccount} = useAppState();

  useEffect(() => {
    console.log('=Game=: Fetching leaderboard');
    (async () => {
      if (connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [leaderboardPDA] = getLeaderboardPDA(farmProgram);
        const leaderboardAccount = await fetchLeaderboardAccount(
          farmProgram,
          leaderboardPDA,
        );
        if (leaderboardAccount) {
          const data = leaderboardAccount.leaderboard.map(entry => {
            return {
              wallet: entry.wallet,
              points: entry.points.toNumber(),
            };
          });
          setEntries(data);
        }

        setIsLoading(false);
      }
    })();
  }, [connection]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>🏆 All Time</Text>
        <LeaderboardEntry
          isHeader={true}
          rankColText="Rank"
          addressColText="Address"
          pointsColText="Harvest Points"
        />
        {entries.map((leaderboardEntry, index) => {
          return (
            <>
              <View style={styles.divider} />
              <LeaderboardEntry
                key={index}
                isHeader={false}
                rankColText={String(index + 1)}
                addressColText={truncatePublicKey(
                  leaderboardEntry.wallet.toBase58(),
                )}
                pointsColText={leaderboardEntry.points.toString()}
              />
            </>
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
      {!isLoading && (
        <View style={styles.submitButton}>
          <GameButton
            disabled={!farmAccount}
            text="🏆 Submit your score 🏆"
            onPress={async () => {
              await transact(async wallet => {
                await authorizeSession(wallet);
              });
            }}
          />
        </View>
      )}
      {
        // If leaderboard account has not been globally initialized
        !isLoading && entries.length === 0 ? (
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
