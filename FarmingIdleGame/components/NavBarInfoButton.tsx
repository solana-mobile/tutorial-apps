import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = Readonly<{
  onPress: () => void;
  // children: React.ReactElement;
}>;

export default function NavBarInfoButton({onPress}: Props) {
  return (
    <>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <FontAwesome
          size={28}
          style={{marginBottom: -3}}
          color="black"
          name="question-circle-o"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
