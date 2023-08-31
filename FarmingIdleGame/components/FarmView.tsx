import {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback} from 'react-native';

const HOVER_DURATION = 2000;

function FarmView() {
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

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      // TODO: Add the harvest action here if needed, for example: onPress={harvestAction}
    >
      <Animated.Image
        source={require('../assets/farm2.png')}
        style={[
          styles.image,
          {
            transform: [{translateY: translateY}, {scale: scale}],
          },
        ]}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginRight: 10,
  },
});

export default FarmView;
