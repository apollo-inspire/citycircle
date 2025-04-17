import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import Localdatabasetestcomponent from './localdatabasetestcomponent'; // Adjust path if needed

const DatabaseScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Database Test Screen</Text>
      <Localdatabasetestcomponent place={{ id: '0', name: 'Rotown' }} />
      <Localdatabasetestcomponent place={{ id: '1', name: 'Erasmus Esports' }} />
    </SafeAreaView>
  );
};

export default DatabaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
