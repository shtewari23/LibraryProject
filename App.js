import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage';
import {  StyleSheet } from 'react-native';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator style={styles.container}>
        <Stack.Screen name="Home" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'black',

    paddingTop: 20,

  },
})

export default App;
