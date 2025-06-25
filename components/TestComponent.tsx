import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const TestComponent = () => {
  return (
    <Text style={styles.text}>Test</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});

export default TestComponent;
