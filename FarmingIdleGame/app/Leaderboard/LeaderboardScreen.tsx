import {StyleSheet, Text, View} from 'react-native';
import {useAppState} from '../../hooks/useAppState';
import {
  fetchLeaderboardAccount,
  getFarmingGameProgram,
  getLeaderboardPDA,
} from '../../program-utils/farmingProgram';
import {useEffect} from 'react';

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
      <Text style={[isHeader && styles.headerCell, styles.rankCell]}>
        {rankColText}
      </Text>
      <Text style={[isHeader && styles.headerCell, styles.addressCell]}>
        {addressColText}
      </Text>
      <Text style={[isHeader && styles.headerCell, styles.pointsCell]}>
        {pointsColText}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const {farmAccount, connection} = useAppState();

  useEffect(() => {
    console.log('Attempting to fetch leaderboard');
    (async () => {
      console.log('Conn check');

      if (connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [leaderboardPDA] = getLeaderboardPDA(farmProgram);
        const leaderboardAccount = await fetchLeaderboardAccount(
          farmProgram,
          leaderboardPDA,
        );
        console.log(leaderboardAccount);
      }
    })();
  }, [connection]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>All Time</Text>
        <LeaderboardEntry
          isHeader={true}
          rankColText="Rank"
          addressColText="Address"
          pointsColText="Harvest Points"
        />
      </View>
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
  },
  headerCell: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  rankCell: {
    flexBasis: '20%',
  },
  addressCell: {
    flexBasis: '30%',
  },
  pointsCell: {
    flexBasis: '50%',
    textAlign: 'right',
  },
});
