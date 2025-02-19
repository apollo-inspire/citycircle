import { View, Text, Image, StyleSheet, Platform, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react'

import { PLACES_DEMO } from '@/constants/PlacesDemo'
import PLACES_IMAGES from '@/constants/PlacesDemoImages'

export default function Places() {
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
    <>
      <Stack.Screen options={{ title: 'Places',  headerShown: false }} />
      <Container style={styles.container}>
        <Text style={styles.text}>List of Places</Text>
        <FlatList 
          data={PLACES_DEMO}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.placeContainer}>
              <Image style={styles.iconImg} source={PLACES_IMAGES[item.id]}></Image>
              <View>
                <Text style={styles.textName}>{item.name}</Text>
                <Text style={styles.textType}>{item.type}</Text>
              </View>
            </View>
          )}
          />
      </Container>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    text: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textName: {
      color: 'white',
      fontSize: 32,
      fontWeight: 'bold',
      // textAlign: 'center',
    },
    textType: {
        color: 'white',
        fontSize: 28,
        fontWeight: '400',
        // textAlign: 'center',
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: "#202020",
    },
    placeContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    iconImg: {
      width: 80,
      height: 80,
    }
})