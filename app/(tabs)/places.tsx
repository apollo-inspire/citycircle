import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { PLACES_DEMO } from '@/constants/Places';
// import useDatabase from "@/database/database2"

import { Colors } from '@/constants/Colors';

import { getDistanceFromLatLonInKm } from '@/utils/distance';
import { getIsOpenNow } from '@/utils/opentimes';

import MultiselectDropdown from '@/components/MultiselectDropdown';
// import TestComponent from '@/components/TestComponent';

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

  const [openNowOnly, setOpenNowOnly] = useState(false);

  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
 
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const saved = await AsyncStorage.getItem('bookmarkedPlaces');
        if (saved) {
          const parsed = JSON.parse(saved);
          // convert all to numbers just in case
          const numbers = parsed.map((id) => Number(id));
          setBookmarkedPlaces(numbers);
        }
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    };
    loadBookmarks();
  }, []);

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

    const applyUserDefaults = async () => {
    try {
      const saved = await AsyncStorage.getItem('userInterests');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedTypes(parsed);
      }
    } catch (e) {
      console.error('Failed to apply saved interests:', e);
    }
  };

  useEffect(() => {
    const loadUserInterests = async () => {
      try {
        const saved = await AsyncStorage.getItem('userInterests');
        if (saved) {
          setSelectedTypes(JSON.parse(saved)); // preselect but don’t update
        }
      } catch (e) {
        console.error('Failed to load interests:', e);
      }
    };
    loadUserInterests();
  }, []);


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

      const matchesOpenNow = !openNowOnly || getIsOpenNow(place.opening_times);

      // console.log('BookmarkedPlaces:', bookmarkedPlaces);
      // console.log('Bookmark check:', place.id.toString(), bookmarkedPlaces.includes(place.id));

      const matchesBookmark = !showBookmarksOnly || bookmarkedPlaces.includes(place.id);

      return matchesType && matchesLocation && matchesOpenNow && matchesBookmark;
    });


    let sorted = [...filtered];

    if (userLocation) {
      // Sort by distance
      sorted.sort((a, b) => {
        const distA = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        // const distA = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, a.latitude, a.longitude);
        // const distB = getDistanceFromLatLonInKm(CITY_CENTER.latitude, CITY_CENTER.longitude, b.latitude, b.longitude);
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
  }, [selectedTypes, selectedLocations, userLocation, openNowOnly, showBookmarksOnly]);


  
  const WhiteCheckIcon = () => (
    <Text style={{ color: Colors.dark.text, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

  return (
    <Provider>
      <Stack.Screen options={{ title: 'Places',  headerShown: true }} />
      <Container style={styles.container}>
        {/* <Text style={styles.text}>List of Places</Text> */}
        {/* <TestComponent/> */}
        <View style={styles.topperContainer}>
          <MultiselectDropdown
              open={locationOpen}
              setOpen={setLocationOpen}
              value={selectedLocations}
              setValue={setSelectedLocations}
              items={locationOptions}
              setItems={setLocationOptions}
              placeholder="Filter by city and districts..."
              searchPlaceholder="Search city or district..."
              onOpen={() => setOpen(false)}
              zIndex={3000}
              zIndexInverse={1000}
          />

          <MultiselectDropdown
            open={open}
            setOpen={setOpen}
            value={selectedTypes}
            setValue={setSelectedTypes}
            items={typeOptions}
            setItems={setTypeOptions}
            placeholder="Filter by types and tags..."
            searchPlaceholder="Search types or tags..."
            onOpen={() => setLocationOpen(false)}
            zIndex={2000}
            zIndexInverse={1000}
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

              <TouchableOpacity
                style={styles.defaultButton}
                onPress={applyUserDefaults}
              >
                <Text style={styles.defaultButtonText}>Reset to My Interests</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
                style={[
                  styles.defaultButton,
                  { backgroundColor: openNowOnly ? Colors.basic.state.succes[300] : Colors.dark.background800 }
                ]}
                onPress={() => setOpenNowOnly(!openNowOnly)}
              >
                <Text style={styles.defaultButtonText}>
                  {openNowOnly ? 'Only Open Now ✓' : 'Filter: Open Now'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                  styles.defaultButton,
                  { 
                    backgroundColor: showBookmarksOnly ? Colors.basic.state.succes[300] : Colors.dark.background800,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }
                ]}
                onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
              >
              <Text style={styles.defaultButtonText}>
                {showBookmarksOnly ? 'Bookmarked Only ✓' : 'Filter: Bookmarked'}
              </Text>
            </TouchableOpacity>


            
          </View>
          
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 }}>
            <Text style={[styles.textDefault, { marginRight: 8 }]}>Show Bookmarked Only</Text>
            <Switch
              value={showBookmarksOnly}
              onValueChange={setShowBookmarksOnly}
              thumbColor={showBookmarksOnly ? Colors.basic.state.succes[300] : undefined}
            />
          </View> */}
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
                  {/* <Image style={styles.iconImg} source={PLACES_IMAGES[item.id]} /> */}
                  <View style={styles.textAllContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.textName}>{item.name}</Text>
                      <Text style={styles.textType}>{item.type}</Text>
                    </View>
                    <View style={styles.textDetailsContainer}>
                      <Text style={styles.textDetails}>
                        {item.city}{item.district ? `, ${item.district}` : ''}
                      </Text>
                      <Text style={[ styles.openStatus, { color: isOpen ? Colors.basic.state.succes[300] : Colors.basic.state.error[300] },]} >
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
      fontFamily: 'Poppins-Regular',
      flex: 1,
      // flexDirection: 'column',
  },
  textDefault: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 20,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textName: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    // textAlign: 'center',
    maxWidth: 150,
    overflow: "hidden",
  },
  textType: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 15,
    // fontWeight: '400',
    // textAlign: 'center',
    maxWidth: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: Colors.dark.background,
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
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: "auto",
    backgroundColor: Colors.dark.backgroundCard,
    padding: 15,
    height: 110
  },

  textAllContainer: {
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '400',
    // textAlign: 'center',
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "right"
  },

  listHeaderFooterComponent: {
    color: Colors.dark.text,
    textAlign: 'center',
    marginHorizontal: 'auto',
  },
  topperContainer: {
    zIndex: 3000,
    backgroundColor: Colors.dark.background900,
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
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 1,
    marginHorizontal: 3,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  dropdownDark: {
    margin: 10,
    backgroundColor: Colors.dark.backgroundCard,
    // borderColor: '#444',
    zIndex: 3000,
  },

  dropdownContainerDark: {
    backgroundColor: Colors.dark.backgroundCard,
    // borderColor: '#444',
    maxHeight: 600
  },

  dropdownText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
  },

  dropdownPlaceholder: {
    color: Colors.dark.textLowcontrast,
  },

  searchInputDark: {
    fontFamily: 'Poppins-Regular',
    padding: 12,
    // borderWidth: 1,
    // borderColor: '#555',
    borderRadius: 6,  
    marginVertical: 1,
    marginHorizontal: 3,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.background900,
  },

  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: Colors.dark.buttonGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButtonText: {
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
    color: Colors.dark.text,
  },
  openStatus: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    // fontWeight: 'bold',
    marginTop: 4,
  },

  defaultButton: {
  marginLeft: 8,
  paddingHorizontal: 10,
  paddingVertical: 12,
  backgroundColor: Colors.dark.buttonGray,
  borderRadius: 8,
  marginBottom: 10,
  },
  defaultButtonText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.dark.text,
  },

})