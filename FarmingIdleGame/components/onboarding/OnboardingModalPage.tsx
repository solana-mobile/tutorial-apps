import {StyleSheet, Text, View} from 'react-native';

type Props = Readonly<{
  title: string;
  children: React.ReactNode;
}>;

export default function OnboardingModalPage({title, children}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.paragraphContainer}>
        <Text style={styles.paragraph}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  paragraphContainer: {
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 12,
  },
  boldedText: {
    fontWeight: 'bold',
  },
  paragraph: {
    textAlign: 'justify',
    fontSize: 18,
  },
});
