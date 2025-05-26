import { View, Text, Image, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { PLACES_DEMO } from '@/constants/Places';
import PLACES_IMAGES from '@/constants/PlacesDemoImages';


export default function PlaceDetail() {
  // Get the ID from the URL
  const { id } = useLocalSearchParams();

  const router = useRouter();

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

  const formatOpeningTimes = (openingTimes) => {
    const days = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' },
    ];

    return days.map(({ key, label }) => {
      const open = openingTimes[`${key}_open`];
      const close = openingTimes[`${key}_close`];
      const time = open && close ? `${open}-${close}` : 'Closed';
      return `${label}: ${time}`;
    });
  };

  const openingTimesFormatted = formatOpeningTimes(place.opening_times);


  const getIsOpenNow = (openingTimes) => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. "monday"
    const openTime = openingTimes[`${weekday}_open`];
    const closeTime = openingTimes[`${weekday}_close`];

    if (!openTime || !closeTime) {
      return false; // Closed today
    }

    // Parse time strings to hours and minutes
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date(now);
    openDate.setHours(openHour, openMinute, 0);

    const closeDate = new Date(now);
    closeDate.setHours(closeHour, closeMinute, 0);

    return now >= openDate && now <= closeDate;
  };

  const isOpen = getIsOpenNow(place.opening_times);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Place Detail", headerShown: true }} />
      <View style={styles.content}>
        <Image style={styles.image} source={PLACES_IMAGES[place.id]} />
        <Text style={styles.text}>{place.name}</Text>
        <Text style={styles.textType}>{place.type}</Text>

        <Text style={styles.textDetails}>{place.city}{place.district ? `, ${place.district}` : null}</Text>
        
        <Text style={[styles.textDetails, { fontWeight: 'bold', color: isOpen ? 'lightgreen' : 'tomato' }]}>
          {isOpen ? 'Open Now' : 'Closed Now'}
        </Text>


        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(tabs)/map',
              params: {
                focusLat: place.latitude,
                focusLng: place.longitude,
              },
            });
          }}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: '#444',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Show on Map
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        
        <Text style={styles.textDetails}>Address: {place.address}</Text>
        <Text style={styles.textDetails}>Languages: {place.languages.join(', ')}</Text>
        <Text style={styles.textDetails}>Description: {place.description}</Text>

        <TouchableOpacity onPress={() => Linking.openURL(place.website)}>
          <Text style={[styles.textDetails, styles.link]}>Link to Website</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(place.google_maps_link)}>
          <Text style={[styles.textDetails, styles.link]}>Link to Google Maps</Text>
        </TouchableOpacity>

        <View style={styles.separator} />
        <Text style={styles.textDetails}>Opening Times:</Text>
        {openingTimesFormatted.map((line, index) => (
          <Text key={index} style={styles.textDetails}>{line}</Text>
        ))}

        <Text style={styles.textDetails}>
          Tags: {place.tags
            .map(tag =>
              tag
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            )
            .join(', ')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textType: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  textDetails: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  link: {
    color: 'lightblue',
    textDecorationLine: 'underline',
  },
  separator: {
    borderBottomColor: '#333',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
    alignSelf: 'stretch',
  },

});