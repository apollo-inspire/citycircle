import { View, Text, Image, StyleSheet, Platform, ScrollView, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';

import { PLACES_DEMO } from '@/constants/Places'
// import useDatabase from "@/database/database2"
import PLACES_IMAGES from '@/constants/PlacesDemoImages'


export default function Places() {
  // const database = useDatabase();
  const [places, setPlaces] = useState([]);

  const Provider = Platform.OS === 'web' ? null : SafeAreaProvider;
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const listHeaderComponent = <Text style={styles.textDefault}>Top of List</Text>
  const listFooterComponent = <Text style={styles.textDefault}>End of List</Text>

  const CITY_CENTER = { latitude: 51.9178565, longitude: 4.4811894 }; // Rotterdam

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const data = await database.getData();
  //     let filteredPlaces = PLACES_DEMO.filter(place => place.type.toLowerCase().includes(""));
  //     setPlaces(filteredPlaces);
  //   };

  //   fetchData();
  // }, []);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationOpen, setLocationOpen] = useState(false);

  const [userLocation, setUserLocation] = useState<null | { latitude: number, longitude: number }>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    console.log(R * 2 * Math.asin(Math.sqrt(a)))
    return R * 2 * Math.asin(Math.sqrt(a));
  }


  useEffect(() => {
  const types = PLACES_DEMO.map(place => place.type.toLowerCase());
  const allTags = PLACES_DEMO.flatMap(place => place.tags.map(tag => tag.toLowerCase()));
  const combined = Array.from(new Set([...types, ...allTags]));

  const formattedTypes = combined.map(entry => ({
    label: entry.charAt(0).toUpperCase() + entry.slice(1),
    value: entry,
  }));

  const locations = Array.from(
    new Set([...PLACES_DEMO.map(p => p.city), ...PLACES_DEMO.map(p => p.district)])
  ).map(location => ({
    label: location,
    value: location,
  }));

  setTypeOptions(formattedTypes);
  setLocationOptions(locations);
}, []);


  useEffect(() => {
    const filtered = PLACES_DEMO.filter(place => {
      const type = place.type.toLowerCase();
      const tags = place.tags.map(tag => tag.toLowerCase());

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(type) ||
        tags.some(tag => selectedTypes.includes(tag));

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(place.city) ||
        selectedLocations.includes(place.district);

      return matchesType && matchesLocation;
    });

    let sorted = [...filtered];

    if (userLocation) {
      // Sort by distance
      sorted.sort((a, b) => {
        // const distA = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        // const distB = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        const distA = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, a.latitude, a.longitude);
        const distB = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    } else {
      // Fallback: alphabetical
      // sorted.sort((a, b) => a.name.localeCompare(b.name));

      // City center fallback
      sorted.sort((a, b) => {
      const distA = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, a.latitude, a.longitude);
      const distB = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, b.latitude, b.longitude);
      return distA - distB;
      });
    } 

    setPlaces(sorted);
  }, [selectedTypes, selectedLocations, userLocation]);

  const getIsOpenNow = (openingTimes) => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. "monday"
    const openTime = openingTimes[`${weekday}_open`];
    const closeTime = openingTimes[`${weekday}_close`];

    if (!openTime || !closeTime) return false;

    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date(now);
    openDate.setHours(openHour, openMinute, 0);

    const closeDate = new Date(now);
    closeDate.setHours(closeHour, closeMinute, 0);

    return now >= openDate && now <= closeDate;
  };

  return (
    <Provider>
      <Stack.Screen options={{ title: 'Places',  headerShown: false }} />
      <Container style={styles.container}>
        <Text style={styles.text}>List of Places</Text>

        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={locationOpen}
            multiple={true}
            value={selectedLocations}
            items={locationOptions}
            setOpen={setLocationOpen}
            setValue={setSelectedLocations}
            setItems={setLocationOptions}
            placeholder="Filter by city and districts..."
            searchable={true}
            searchPlaceholder="Search city or district..."
            searchTextInputStyle={styles.searchInput}
            onOpen={() => setOpen(false)}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <DropDownPicker
            open={open}
            multiple={true}
            value={selectedTypes}
            items={typeOptions}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue = callback(selectedTypes);
              setSelectedTypes(newValue.map(val => val.toLowerCase()));
            }}
            setItems={setTypeOptions}
            placeholder="Filter by types and tags..."
            searchable={true}
            searchPlaceholder="Search types or tags..."
            searchTextInputStyle={styles.searchInput}
            onOpen={() => setLocationOpen(false)}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSelectedTypes([]);
                setSelectedLocations([]);
                setOpen(false);
                setLocationOpen(false);
              }}
            >
              <Text style={styles.clearButtonText}>Deselect All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList 
          style={styles.flatList}
          data={places}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          // ListHeaderComponent={listHeaderComponent}
          // ListHeaderComponentStyle={ styles.listHeaderFooterComponent }
          ListFooterComponent={listFooterComponent}
          ListFooterComponentStyle={ styles.listHeaderFooterComponent }
          ListEmptyComponent={<Text style={styles.textDefault} >No Items</Text>}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isOpen = getIsOpenNow(item.opening_times);

            return (
              <Link href={`/place/${item.id}`} asChild>
                <Pressable style={styles.placeContainer}>
                  <Image style={styles.iconImg} source={PLACES_IMAGES[item.id]} />
                  <View style={styles.textAllContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.textName}>{item.name}</Text>
                      <Text style={styles.textType}>{item.type}</Text>
                    </View>
                    <View style={styles.textDetailsContainer}>
                      <Text style={styles.textDetails}>
                        {item.city}{item.district ? `, ${item.district}` : ''}
                      </Text>
                      <Text style={[ styles.openStatus, { color: isOpen ? 'lightgreen' : 'tomato' },]} >
                          {isOpen ? 'Open Now' : 'Closed Now'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            );
          }}
          />
      </Container>
    </Provider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
    },
    textDefault: {
      color: 'white',
      fontSize: 20,
  },
    text: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textName: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      // textAlign: 'center',
      maxWidth: 200,
      overflow: "hidden",
    },
    textType: {
      color: 'white',
      fontSize: 16,
      fontWeight: '400',
      // textAlign: 'center',
      maxWidth: 150,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: "#202020",
    },

    flatList: {
      flex: 1,
      flexDirection: "column",
    },

    placeContainer: {
      flex: 1,
      flexDirection: 'row',
      width: "100%",
      maxWidth: 600,
      marginBottom: 10,
      borderRadius: 20,
      overflow: "hidden",
      marginHorizontal: "auto",
      backgroundColor: "#333",
      padding: 15,
      height: 110
    },

    textAllContainer: {
      flex: 1,
      flexDirection: 'row',
      width: "100%",
      justifyContent: 'space-between'
    },
    textContainer: {
      marginLeft: 20,
      height: "100%",
      marginVertical: "auto",
    },
    iconImg: {
      width: 70,
      height: 70,
    },

    textDetailsContainer: {
      marginLeft: 3,
      height: "100%",
      maxWidth: 150,
      alignItems: "flex-end",      // Align text to the right
      justifyContent: "center",    // Vertically center
    },
    textDetails: {
      color: 'white',
      fontSize: 14,
      fontWeight: '400',
      // textAlign: 'center',
      maxWidth: 150,
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "right"
    },

    listHeaderFooterComponent: {
      color: 'white',
      textAlign: 'center',
      marginHorizontal: 'auto',
    },
    dropdown: {
    margin: 10,
    zIndex: 3000,
    },
    dropdownContainer: {
      zIndex: 2000,
    },
    searchInput: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      marginVertical: 1,
      marginHorizontal: 3,
    },
    dropdownWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    clearButton: {
      marginLeft: 8,
      paddingHorizontal: 10,
      paddingVertical: 12,
      backgroundColor: '#ddd',
      borderRadius: 6,
      marginBottom: 10,
    },
    clearButtonText: {
      fontWeight: 'bold',
      color: '#333',
    },
    openStatus: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 4,
    },
})