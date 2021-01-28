import * as React from 'react'

import NewGame from './components/NewGame'
import Defeat from './components/Defeat'
import Game from './components/Game'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'

// Export the entry point for React Native

const Stack = createStackNavigator()
enableScreens()

export default function App () {
  const screenOptions={
    headerShown: false
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='NewGame'>
        <Stack.Screen name='NewGame' component={NewGame} options={screenOptions} />
        <Stack.Screen name='Game' component={Game} options={screenOptions} />
        <Stack.Screen name='Defeat' component={Defeat} options={screenOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
