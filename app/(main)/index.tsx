import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CityCircle</Text>
      <Text style={styles.subtitle}>Discover places, meet new people, and explore your city—your way.</Text>

      <Link href="/map" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Open Map</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101828',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#F3F4F6',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#99A1AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FFC021',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#030712',
  },
});
