import {StyleSheet, Text, View} from 'react-native';

import {FarmAccount} from '../program-utils/accountTypes';
import {useState, useEffect} from 'react';
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
    <View>
      <Text>Harvested: {farmAccount.harvestPoints.toString()}</Text>
      <Text>Available harvest: {availableHarvest}</Text>
      <Text>
        Last Harvested:{' '}
        {unixTimestampToFormattedDate(farmAccount.lastHarvested.toNumber())}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
