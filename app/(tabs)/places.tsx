import { View, Text, StyleSheet} from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react'

const places = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Places',  headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.text}>List of Places</Text>
      </View>
    </>
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