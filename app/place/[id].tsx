import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PLACES_DEMO } from '@/constants/Places';
import PLACES_IMAGES from '@/constants/PlacesDemoImages';


import { Colors } from '@/constants/Colors';




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
        <Text style={styles.textTitle}>{place.name}</Text>
        <Text style={styles.textType}>{place.type}</Text>

        <Text style={styles.textDetails}>{place.city}{place.district ? `, ${place.district}` : null}</Text>

        <Text style={[styles.textDetails, { fontFamily: 'Poppins-Bold', color: isOpen ? Colors.basic.state.succes[300] : Colors.basic.state.error[300] }]}>
          {isOpen ? 'Open Now' : 'Closed Now'}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
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
            style={styles.button}>
          <Text style={styles.buttonText}>
            Show on Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(place.google_maps_directions_link)} style={styles.button}>
          <Text style={styles.buttonText}>Directions</Text>
          {/* <Text style={styles.buttonText}>Directions (Google Maps)</Text> */}
        </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        
        <Text style={styles.textDetails}>Address: {place.address}</Text>
        <Text style={styles.textDetails}>Languages: {place.languages.join(', ')}</Text>
        <Text style={styles.textDetails}>Description: {place.description}</Text>

        <TouchableOpacity onPress={() => Linking.openURL(place.website)}>
          <Text style={[styles.textDetails, styles.link]}>Link to Website</Text>
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
    backgroundColor: Colors.dark.background900,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background900,
    padding: 20,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    color: Colors.dark.text,
    fontSize: 32,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  textTitle: {
    fontFamily: 'Poppins-Bold',
    color: Colors.basic.primary[400],
    fontSize: 36,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  textType: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 24,
    marginBottom: 10,
  },
  textDetails: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 18,
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  link: {
    color: Colors.dark.link,
    textDecorationLine: 'underline',
  },
  separator: {
    borderBottomColor: Colors.basic.gray[700],
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
    alignSelf: 'stretch',
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.dark.buttonGray,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.dark.text, 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold',
  }
});