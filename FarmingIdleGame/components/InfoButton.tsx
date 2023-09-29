import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './NavBarInfoButton';

export default function InfoButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => Alert.alert('Info', 'This is some information!')}>
      <Icon name="information-circle-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}
