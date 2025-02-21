import { View, Text, Image, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { PLACES_DEMO } from '@/constants/PlacesDemo';
import PLACES_IMAGES from '@/constants/PlacesDemoImages';

export default function PlaceDetail() {
  // Get the ID from the URL
  const { id } = useLocalSearchParams();

  // Convert ID to number and find the place
  const place = PLACES_DEMO.find((p) => p.id === Number(id));

  // If the place doesn't exist, show an error message
  if (!place) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Place not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Place Detail", headerShown: true }} />
      <Image style={styles.image} source={PLACES_IMAGES[place.id]} />
      <Text style={styles.text}>{place.name}</Text>
      <Text style={styles.textType}>{place.type}</Text>
      <Text style={styles.textDetails}>City: {place.city}</Text>
      <Text style={styles.textDetails}>District: {place.district}</Text>
      <Text style={styles.textDetails}>Languages: {place.languages.join(', ')}</Text>
      <Text style={styles.textDetails}>Next Opening: {place.next_opening_time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202020', padding: 20 },
  text: { color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  textType: { color: 'gray', fontSize: 20, marginBottom: 10 },
  textDetails: { color: 'white', fontSize: 18, marginVertical: 5 },
  image: { width: 100, height: 100, marginBottom: 20 }
});