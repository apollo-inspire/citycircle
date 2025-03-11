import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE, Region, Marker, Callout } from 'react-native-maps'

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