import {Entypo} from '@expo/vector-icons';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = Readonly<{
  title: string;
  subtitle: string | null | undefined;
  onPress?: () => void;
  children?: React.ReactNode;
}>;

export default function InfoCard({title, subtitle, onPress, children}: Props) {
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={false}>
      <View style={styles.card}>
        <View style={styles.bodySection}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>

          {children}
        </View>
        <View style={styles.rightIcon}>
          <Entypo name="chevron-thin-right" size={24} color="black" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
    marginBottom: 10,
  },
  bodySection: {
    flexDirection: 'column',
  },
  rightIcon: {
    flexGrow: 1,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
});
