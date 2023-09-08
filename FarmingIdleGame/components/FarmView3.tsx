import {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import useAvailableHarvest from '../hooks/useAvailableHarvest';
import {formatNumber, getCpS} from '../program-utils/cropUpgrades';
import {FarmAccount} from '../program-utils/farmingProgram';
import {useAppState} from '../store/useAppState';
import FarmImage from './FarmImage';
import GameButton from './GameButton';

type Props = Readonly<{
  farmAccount: FarmAccount;
}>;

export default function FarmView3({farmAccount}: Props) {
  const {harvestFarm} = useAppState();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const {availableHarvest} = useAvailableHarvest({farmAccount});

  const handleHarvest = useCallback(async () => {
    setIsHarvesting(true);
    try {
      await harvestFarm();
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(`Failed to harvest: ${error.message}`);
      }
    } finally {
      setIsHarvesting(false);
    }
  }, [harvestFarm]);

  useEffect(() => {
    console.log('MOUNTING');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pointsHeader}>
        <Text style={styles.harvestedText}>
          🌾 {formatNumber(farmAccount.harvestPoints.toNumber())} 🌾
        </Text>
        <Text> crops harvested </Text>
      </View>
      <FarmImage isHarvesting={isHarvesting} onPress={handleHarvest} />
      <View style={styles.textSection}>
        <GameButton
          text={`Harvest! (+${
            availableHarvest === 0
              ? '1 crop)'
              : Math.floor(availableHarvest) + ' crops)'
          }`}
          disabled={isHarvesting}
          onPress={handleHarvest}
        />
        <Text style={styles.text}>
          (+{Math.floor(getCpS(farmAccount))} 🌾 per second)
        </Text>
      </View>
    </View>
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
  harvestedText: {
    fontSize: 32,
    color: '#333', // Dark gray text color
  },
  text: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
});
