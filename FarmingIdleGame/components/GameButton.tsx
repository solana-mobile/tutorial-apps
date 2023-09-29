import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';

type Props = Readonly<{
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}>;

export default function GameButton({text, disabled, onPress}: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      disabled={disabled}
      android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
      onPress={onPress}>
      <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 3,
    backgroundColor: 'black',
  },
  disabled: {
    backgroundColor: '#2E2E2E', // slightly lighter than black
    elevation: 0, // no shadow
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  disabledText: {
    color: '#B0B0B0', // a grayish tone
  },
});
