import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/Colors';

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

      <View style={styles.topperContainer}>
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
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
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
    fontFamily: 'Poppins-Regular',
    flex: 1,
    zIndex: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.buttonGray,
    borderRadius: 8,
    marginBottom: 10,
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
  clearButtonText: {
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    padding: 12,
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 6,  
    marginVertical: 1,
    marginHorizontal: 3,
  },
  markerContainer: {
    color: Colors.basic.gray[700],
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  markerLabel: {
    backgroundColor: Colors.dark.text,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    // borderRadius: 6,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // marginBottom: 4,
    // maxWidth: 500,
  },

  markerLabelText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.dark.text,
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

});


export default MapScreen;