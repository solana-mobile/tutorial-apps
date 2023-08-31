import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {FarmAccount} from '../program-utils/accountTypes';
import {getCpS} from '../program-utils/cropUpgrades';

type Props = Readonly<{
  farmAccount: FarmAccount;
}>;

function unixTimestampToFormattedDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export default function FarmAccountInfo({farmAccount}: Props) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 100);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty array ensures effect is only run on mount and unmount

  // Calculate the elapsed time in seconds
  const elapsedSeconds = farmAccount
    ? currentTime - farmAccount.lastHarvested.toNumber()
    : 0;

  // Calculate the accumulated coins
  const availableHarvest = farmAccount
    ? elapsedSeconds * getCpS(farmAccount)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Image
          source={require('../assets/harvestpointicon.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>
          {farmAccount.harvestPoints.toString()} Harvest points
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Image
          source={require('../assets/harvestpointicon.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>{availableHarvest}</Text>
      </View>
      <Text style={styles.text}>
        Last Harvested:{' '}
        {unixTimestampToFormattedDate(farmAccount.lastHarvested.toNumber())}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f7f7f7', // Light gray
    borderWidth: 1,
    borderColor: '#e0e0e0', // Slightly darker gray
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
  text: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
});
