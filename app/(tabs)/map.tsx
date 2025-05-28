import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import { PLACES_DEMO } from '@/constants/Places';

const INITIAL_REGION = {
  latitude: 51.9205651,
  longitude: 4.4856543,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};


const MapScreen = () => {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();
  const router = useRouter();

  const { focusLat, focusLng } = useLocalSearchParams();

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


  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.showCallout();
    }
  }, []);

  useEffect(() => {
    if (focusLat && focusLng && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(focusLat as string),
        longitude: parseFloat(focusLng as string),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [focusLat, focusLng]);

  const WhiteCheckIcon = () => (
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

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
          style={styles.dropdownDark}
          dropDownContainerStyle={styles.dropdownContainerDark}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          searchTextInputStyle={styles.searchInputDark}
          searchable={true}
          searchPlaceholder="Search city or district..."
          TickIconComponent={WhiteCheckIcon}
          onOpen={() => setOpen(false)}
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
          style={styles.dropdownDark}
          dropDownContainerStyle={styles.dropdownContainerDark}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          searchTextInputStyle={styles.searchInputDark}
          searchable={true}
          searchPlaceholder="Search types or tags..."
          TickIconComponent={WhiteCheckIcon}
          onOpen={() => setLocationOpen(false)}
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
            ref={markerRef}
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => onMarkerSelected(marker)}
            title={marker.name}
            // description={marker.district}
          >
            {/* <View style={styles.markerContainer}>
              <Image 
                source={require('@/assets/images/map-marker.png')}
                style={styles.markerImage}
              />
              <View style={styles.markerLabel}>
                <Text style={styles.markerLabelText}>{marker.name}</Text>
              </View> 
            </View> */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const mapStyle = [
  // On/off
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }]
  },

  // Color
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
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
    backgroundColor: '#444',
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownDark: {
  margin: 10,
  backgroundColor: '#2a2a2a',
  borderColor: '#444',
  zIndex: 3000,
  },

  dropdownContainerDark: {
    backgroundColor: '#1f1f1f',
    borderColor: '#444',
  },

  dropdownText: {
    color: 'white',
  },

  dropdownPlaceholder: {
    color: '#aaa',
  },

  searchInputDark: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,  
    marginVertical: 1,
    marginHorizontal: 3,
    color: 'white',
    backgroundColor: '#2a2a2a',
  },
  clearButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,  
    marginVertical: 1,
    marginHorizontal: 3,
  },
  markerContainer: {
    color: "#333",
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  markerLabel: {
    backgroundColor: 'white',
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    // borderRadius: 6,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // marginBottom: 4,
    // maxWidth: 500,
  },

  markerLabelText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },

  // markerDot: {
  //   width: 10,
  //   height: 10,
  //   borderRadius: 5,
  //   backgroundColor: '#007AFF',
  //   borderWidth: 2,
  //   borderColor: 'white',
  // },
    markerImage: {
    width: 40,
    height: 40
  }
});


export default MapScreen;