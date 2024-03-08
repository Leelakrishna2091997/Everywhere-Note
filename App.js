import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, TextInput, StyleSheet, Text, View } from 'react-native';
// import {React, useState} from 'react';
import React, { useState } from 'react';
// App.js



// import { View, Text, Button } from 'react-native'

export default function App() {
  const [text, onChangeText] = useState('Useless Text');
  // const [diceRolls, setDiceRolls] = useState("The saved content");

  // const [number, onChangeNumber] = React.useState('');

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Header</Text>
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.contentText}>
          This is some text inside a box. You can customize this paragraph to fit your content needs. This example demonstrates how to align and style components in React Native.
        </Text>
      </View>
    </View>

    // <SafeAreaView>
    //   <TextInput
    //     style={styles.input}
    //     onChangeText={onChangeText}
    //     value={text}
    //   />
    // </SafeAreaView>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text>App is working fine...{diceRolls}</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentBox: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    backgroundColor: '#e9f5ff',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
