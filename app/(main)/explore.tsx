import React, { useState } from 'react'
import { StyleSheet, View, Text, Button, Alert } from 'react-native'
import * as Progress from 'react-native-progress';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Explore = () => {
  const [count, setCount] = useState(0);

  const MAX_CAPACITY = 200;

  const countIncrease = () => {

  };

  const countDecrease = () => {

  };

  const countReset = () => {

  };

  const progress = count / MAX_CAPACITY;


  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Events</Text>
        <View>
          <Button title="+1" onPress={countIncrease} />
          <Button title="-1" onPress={countDecrease} />
          <Button title="Reset" onPress={countReset} />
        </View>
      </SafeAreaView>   
    </SafeAreaProvider>
  )
}

export default Explore