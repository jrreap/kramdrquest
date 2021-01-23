import NewGame from './components/NewGame'
import Defeat from './components/Defeat'
import Game from './components/Game'
import { createAppContainer, createStackNavigator } from 'react-navigation'

const AppNavigator = createStackNavigator(
  {
    Game: Game,
    NewGame: NewGame,
    Defeat: Defeat
  },
  {
    initialRouteName: 'NewGame',
    headerMode: 'none'
  }
)

// Export the entry point for React Native
export default createAppContainer(AppNavigator)
