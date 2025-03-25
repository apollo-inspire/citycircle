import React, { useState } from 'react'
import { StyleSheet, View, Text, Button, Alert, Pressable } from 'react-native'
import * as Progress from 'react-native-progress';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Events = () => {
  const [count, setCount] = useState(10);

  const MAX_CAPACITY = 20;

  const countIncrease = () => {
    if (count < MAX_CAPACITY) {
      setCount(count + 1);
    } else {
      Alert.alert('Maximum capacity reached');
    }
  };

  const countDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
    } 
  };

  const countReset = () => {
    setCount(0);
  };

  const progress = count / MAX_CAPACITY;


  return (
    <SafeAreaProvider>
      <SafeAreaView  style={styles.container}>
        {/* <Button title="+1"></Button> */}
        <Text style={[styles.text, styles.title]}>Boardgame Event - Rotown</Text>
        <View style={styles.buttonRow}>
          <Pressable onPress={countIncrease}><Text style={styles.buttontext}>+1</Text></Pressable>
          <Pressable onPress={countDecrease}><Text style={styles.buttontext}>-1</Text></Pressable>
          <Pressable onPress={countReset}><Text style={styles.buttontext}>Reset</Text></Pressable>
        </View>
        <Text style={[styles.text, styles.counter]}>{count} / {MAX_CAPACITY}</Text>
      </SafeAreaView>   
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    text: {
      fontSize: 40,
      color: 'white',
    },
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    buttontext: {
      fontSize: 40,
      color: 'white',
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      margin: 5,
      alignItems: 'center',
      fontWeight: 'bold',
    },
    title: {
      fontSize: 30,
      marginBottom: 20,
    },
    counter: {
      fontSize: 40,
      marginVertical: 10,
    },
})


export default Events