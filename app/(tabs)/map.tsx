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

  useEffect(() => {
    const types = PLACES_DEMO.map(place => place.type.toLowerCase());
    const allTags = PLACES_DEMO.flatMap(place => place.tags.map(tag => tag.toLowerCase()));
    const combined = Array.from(new Set([...types, ...allTags]));

    const formatted = combined.map(entry => ({
      label: entry.charAt(0).toUpperCase() + entry.slice(1),
      value: entry,
    }));

    setTypeOptions(formatted);
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
  const filteredPlaces = selectedTypes.length === 0
    ? PLACES_DEMO
    : PLACES_DEMO.filter(place => {
        const type = place.type.toLowerCase();
        const tags = place.tags.map(tag => tag.toLowerCase());
        return selectedTypes.includes(type) || tags.some(tag => selectedTypes.includes(tag));
      });

  return (
    <View style={styles.container}>
        <DropDownPicker
            open={open}
            multiple={true}
            value={selectedTypes}
            items={typeOptions}
            setOpen={setOpen}
            setValue={setSelectedTypes}
            setItems={setTypeOptions}
            placeholder="Filter by type..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
        />
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity style={styles.clearButton} onPress={() => setSelectedTypes([])}>
        <Text style={styles.clearButtonText}>Clear Selection</Text>
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
    zIndex: 1000,
  },
  dropdownContainer: {
    zIndex: 999,
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
},
clearButtonText: {
  fontWeight: 'bold',
  color: '#333',
},
});
