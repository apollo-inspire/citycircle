import { View, Text, Image, StyleSheet, Platform, ScrollView, FlatList, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { PLACES_DEMO } from '@/constants/PlacesBasic'
// import useDatabase from "@/database/database2"
import PLACES_IMAGES from '@/constants/PlacesDemoImages'


export default function Places() {
  // const database = useDatabase();
  const [places, setPlaces] = useState([]);

  const Provider = Platform.OS === 'web' ? null : SafeAreaProvider;
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const listHeaderComponent = <Text style={styles.textDefault}>Top of List</Text>
  const listFooterComponent = <Text style={styles.textDefault}>End of List</Text>

  useEffect(() => {
    const fetchData = async () => {
      // const data = await database.getData();
      let filteredPlaces = PLACES_DEMO.filter(place => place.type.toLowerCase().includes("venue"));
      setPlaces(filteredPlaces);
    };

    fetchData();
  }, []);


  return (
    <Provider>
      <Stack.Screen options={{ title: 'Places',  headerShown: false }} />
      <Container style={styles.container}>
        <Text style={styles.text}>List of Places</Text>
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
                  {/* <Text style={styles.textDetails}>{item.next_opening_time}</Text>
                  <Text style={styles.textDetails}>{item.languages}</Text> */}
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
    }
})