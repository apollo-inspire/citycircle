import { View, Text, Image, StyleSheet, Platform, ScrollView, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';

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

  setPlaces(filtered);
}, [selectedTypes, selectedLocations]);

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
          renderItem={({ item }) => (
          <Link href={`/place/${item.id}`} asChild>
            <Pressable style={styles.placeContainer}>
              <Image style={styles.iconImg} source={PLACES_IMAGES[item.id]}></Image>
              <View style={styles.textAllContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textType}>{item.type}</Text>
                </View>
                <View style={styles.textDetailsContainer}>
                  <Text style={styles.textDetails}>{item.city}, {item.district}</Text>
                </View>
              </View>
            </Pressable>
          </Link>
          )}
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
      marginLeft: 20,
      height: "100%",
      marginVertical: "auto",
      maxWidth: 150
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
})