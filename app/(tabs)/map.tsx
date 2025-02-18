import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

import rotterdamMapImg from "@/assets/images/maps-rotterdam.png"

const map = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={rotterdamMapImg}
        resizeMode="cover"
         style={styles.image}
      >
        <Text style={styles.text}>Rotterdam Map</Text>
      </ImageBackground>
    </View>
  )
}

export default map

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
        backgroundColor: 'rgba(0,0,0,0.7)'
    }
})