import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE, Region, Marker, Callout, Polyline, Circle, Heatmap } from 'react-native-maps'

// import rotterdamMapImg from "@/assets/images/maps-rotterdam.png"
import { useNavigation } from '@react-navigation/native';

import { PLACES_DEMO } from '@/constants/PlacesDemo'

const INITIAL_REGION = {
  latitude: 51.9205651,
  longitude: 4.4756543,
  latitudeDelta: 0.07,
  longitudeDelta: 0.07,
};

const map = () => {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}> 
            <Text style={styles.text} >Focus</Text>
          </View>
      </TouchableOpacity>
      )
    })
  })

  const focusMap = () => {
    const LocationFenix = {
      latitude: 51.9020075,
      longitude: 4.486874,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };

    mapRef.current.animateToRegion(LocationFenix);
  };


  const onRegionChange = (region: Region) => {
    // console.log(region);
  };

  const onMarkerSelected = (marker: any) => {
    Alert.alert(`${marker.name}`, `${marker.type}\n${marker.city}, ${marker.district}`);
  }

  const heatmapPoints = [
    { latitude: 51.928852498892, longitude: 4.479435816744115, weight: 1 },
    { latitude: 51.929, longitude: 4.4799, weight: 2 },
    { latitude: 51.9285, longitude: 4.4789, weight: 3 },
    { latitude: 51.9287, longitude: 4.4799, weight: 2.5 },
    { latitude: 51.9282, longitude: 4.4800, weight: 5 },
    { latitude: 51.93, longitude: 4.4850, weight: 10 },
    { latitude: 51.95, longitude: 4.4853, weight: 100 },
  ];


  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={INITIAL_REGION}
        region={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
        rotateEnabled={false} 
        showsCompass
        showsPointsOfInterest={false}
        pitchEnabled
      >
        {PLACES_DEMO.map((marker, index) => (
          <Marker 
            key={index} 
            coordinate={marker} 
            onPress={() => onMarkerSelected(marker)}
          >
            <Callout 
              onPress={() => onMarkerSelected(marker)}
              >
              <View style={{ padding: 10 }}>
                <Text>{marker.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
          <Polyline
            coordinates={[
              {latitude: 51.918852498892, longitude: 4.479435816744115},
              {latitude: 51.91008440463913, longitude: 4.509421634628058},
              {latitude: 51.92, longitude: 4.51},
              {latitude: 51.93, longitude: 4.52},
              {latitude: 51.94, longitude: 4.53},
              {latitude: 51.95, longitude: 4.54},
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={6}
          />
          <Circle
          center={{
            latitude: 51.918852498892,
            longitude: 4.479435816744115,
          }}
          radius={300} // meters
          strokeWidth={2}
          strokeColor="rgba(0,112,255,0.7)"
          fillColor="rgba(0,112,255,0.3)"
          />
          <Heatmap
            points={heatmapPoints}
            opacity={0.7}
            radius={50}
            gradient={{
              colors: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
              startPoints: [0.01, 0.04, 0.1, 0.45, 1],
              colorMapSize: 256,
            }}
          />
      </MapView>
    </View>
  )
}

export default map

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    // image: {
    //   width: '100%',
    //   height: '100%',
    //   flex: 1,
    //   resizeMode: 'cover',
    //   justifyContent: 'center',
    // },
    text: {
        color: 'white',
    //     fontSize: 42,
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    //     backgroundColor: 'rgba(0,0,0,0.7)'
    }
})