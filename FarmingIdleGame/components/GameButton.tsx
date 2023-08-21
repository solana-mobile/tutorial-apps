import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';

type Props = Readonly<{
  text: string;
  disabled: boolean;
  onPress: (event: GestureResponderEvent) => void;
}>;

export default function GameButton({text, disabled, onPress}: Props) {
  return (
    <Pressable
      style={disabled ? styles.disabled : styles.button}
      disabled={disabled}
      android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
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
  disabled: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
