import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import { PLACES_DEMO } from '@/constants/Places';

const INITIAL_REGION = {
  latitude: 51.9205651,
  longitude: 4.4856543,
  latitudeDelta: 0.07,
  longitudeDelta: 0.07,
};

const MapScreen = () => {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();
  const router = useRouter();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState([]);

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

  setLocationOptions(locations);

  setTypeOptions(formattedTypes);

}, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text style={styles.text}>Focus</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }, []);

  const focusMap = () => {
    const location = {
      latitude: 51.9155651,
      longitude: 4.4856543,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    };
    mapRef.current.animateToRegion(location);
  };

  const onMarkerSelected = (marker: any) => {
    router.push(`/place/${marker.id}`);
  };

  // Filter logic
  const filteredPlaces = PLACES_DEMO.filter(place => {
    const matchesType = selectedTypes.length === 0 ||
      selectedTypes.includes(place.type.toLowerCase()) ||
      place.tags.some(tag => selectedTypes.includes(tag.toLowerCase()));

    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(place.city) ||
      selectedLocations.includes(place.district);

    return matchesType && matchesLocation;

    return matchesType && matchesCity && matchesDistrict;
  });

  return (
    <View style={styles.container}>
        <DropDownPicker
          open={locationOpen}
          multiple={true}
          value={selectedLocations}
          items={locationOptions}
          setOpen={setLocationOpen}
          setValue={setSelectedLocations}
          setItems={setLocationOptions}
          placeholder="Filter by city and districts..."
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          searchable={true}
          searchPlaceholder="Search city or district..."
          searchTextInputStyle={styles.searchInput}
          onOpen={() => {
            setOpen(false);
          }}
        />

        <DropDownPicker
          open={open}
          multiple={true}
          value={selectedTypes}
          items={typeOptions}
          setOpen={setOpen}
          setValue={setSelectedTypes}
          setItems={setTypeOptions}
          placeholder="Filter by types and tags..."
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          searchable={true}
          searchPlaceholder="Search types or tags..."
          searchTextInputStyle={styles.searchInput}
          onOpen={() => {
            setLocationOpen(false);
          }}
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

      <MapView
        customMapStyle={mapStyle}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        rotateEnabled={false}
        showsCompass
        showsPointsOfInterest={false}
        pitchEnabled
      >
        {filteredPlaces.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => onMarkerSelected(marker)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
  },
  dropdown: {
    margin: 10,
    zIndex: 3000,
  },
  dropdownContainer: {
    // zIndex: 2000,
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
  searchInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 1,
    marginHorizontal: 3,
  },
});
