import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const places = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>List of Places</Text>
    </View>
  )
}

export default places

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
    }
})