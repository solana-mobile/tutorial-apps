import {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useAppState} from '../hooks/useAppState';
import useAvailableHarvest from '../hooks/useAvailableHarvest';
import {FarmAccount} from '../program-utils/farmingProgram';
import {getCpS} from '../program-utils/utils';
import FarmImage from './FarmImage';
import GameDialogBox from './GameDialogBox';

type Props = Readonly<{
  farmAccount: FarmAccount;
}>;

export default function FarmView({farmAccount}: Props) {
  const {harvestFarm} = useAppState();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [gainedPoints, setGainedPoints] = useState<number | null>(null);
  const {availableHarvest} = useAvailableHarvest({farmAccount});

  const handleHarvest = useCallback(async () => {
    setIsHarvesting(true);
    try {
      const harvestedPoints = await harvestFarm();

      setGainedPoints(harvestedPoints);

      // Display gained points for a brief time, then hide
      setTimeout(() => {
        setGainedPoints(null);
      }, 2000); // for 2 seconds, adjust as needed
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(`Failed to harvest: ${error.message}`);
      }
    } finally {
      setIsHarvesting(false);
    }
  }, [harvestFarm]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pointsHeader}>
          <Text style={styles.headerText}>
            Tap to harvest{' '}
            {availableHarvest === 0 ? '1' : Math.floor(availableHarvest)} 🌾
          </Text>
          <Text style={styles.headerSubtext}>
            (+{Math.floor(getCpS(farmAccount))} 🌾 per second)
          </Text>
        </View>
        <FarmImage isHarvesting={isHarvesting} onPress={handleHarvest} />
        <GameDialogBox
          isHarvesting={isHarvesting}
          gainedPoints={gainedPoints}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
  },
  pointsHeader: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(111, 111, 111, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 32,
  },
  textSection: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark gray text color
  },
  headerSubtext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Dark gray text color
  },
  text: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
  banner: {
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
