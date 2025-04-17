import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

import rotterdamMapImg from "@/assets/images/maps-rotterdam.png"

const index = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={rotterdamMapImg}
        resizeMode="cover"
         style={styles.image}
      >
        <Text style={styles.text}>Dashboard</Text>

        <Link href="/map" style={styles.link}>Map</Link>

        <Link href="/localdatabasetest" style={{ marginHorizontal: 'auto' }} asChild>
            <Pressable style={styles.button}><Text style={styles.buttonText}>Local Database Test</Text></Pressable>
        </Link>
        <Link href="/Explore" style={{ marginHorizontal: 'auto' }} asChild>
            <Pressable style={styles.button}><Text style={styles.buttonText}>Explore</Text></Pressable>
        </Link>
      </ImageBackground>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
      width: '100%',
      height: '100%',
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        marginBottom: 120,
    },
    link: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 4,
    },
    button:{
        height: 60,
        borderRadius: 20, 
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 4,
    }
})