import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {formatNumber} from '../program-utils/utils';

type Props = Readonly<{
  isHarvesting: boolean;
  gainedPoints: number | null;
}>;

export default function GameDialogBox({isHarvesting, gainedPoints}: Props) {
  const [displayText, setDisplayText] = useState<String | null>(null);

  useEffect(() => {
    if (isHarvesting) {
      setDisplayText('Harvesting...');
    } else if (gainedPoints !== null) {
      setDisplayText(`+${formatNumber(gainedPoints)} 🌾 points!`);
    } else {
      setDisplayText(null);
    }
  }, [isHarvesting, gainedPoints]);

  if (!displayText) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.header}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
