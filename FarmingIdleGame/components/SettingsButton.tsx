import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';

type Props = Readonly<{
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
}>;

export default function GameButton({
  title,
  disabled,
  onPress,
  backgroundColor,
  textColor,
}: Props) {
  const backgroundColorStyle = backgroundColor
    ? {backgroundColor: backgroundColor}
    : {backgroundColor: 'black'};
  const textColorStyle = textColor ? {color: textColor} : {color: 'white'};
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled, backgroundColorStyle]}
      disabled={disabled}
      android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
      onPress={onPress}>
      <Text
        style={[styles.text, textColorStyle, disabled && styles.disabledText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 3,
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
    color: 'gray',
  },
  disabledText: {
    color: '#B0B0B0', // a grayish tone
  },
});
