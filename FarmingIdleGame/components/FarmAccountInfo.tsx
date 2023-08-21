import {StyleSheet, Text, View} from 'react-native';

import {FarmAccount} from '../farming-program-utils/accountTypes';

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
  const dateHarvested = new Date(farmAccount.lastHarvested.toNumber());

  return (
    <View>
      <Text>Harvested: {farmAccount.harvestPoints.toString()}</Text>
      <Text>Available harvest: {0}</Text>
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
