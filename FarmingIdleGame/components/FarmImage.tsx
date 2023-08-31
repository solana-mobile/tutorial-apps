import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const HOVER_DURATION = 2000;

type Props = Readonly<{
  isHarvesting: boolean;
  onPress: () => Promise<void>;
}>;

function FarmImage({isHarvesting, onPress}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 7,
          duration: HOVER_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: HOVER_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );

    animate.start();

    return () => animate.stop();
  }, [translateY]);

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = async () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    await onPress();
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isHarvesting}>
        <View>
          <Animated.Image
            source={require('../assets/farm2.png')}
            style={[
              styles.image,
              {
                transform: [{translateY: translateY}, {scale: scale}],
              },
            ]}
          />
          {isHarvesting && <View style={styles.overlay} />}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    borderRadius: 8,
    marginRight: 10,
  },
  text: {
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.3,
    borderRadius: 8,
  },
});

export default FarmImage;
