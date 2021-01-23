import { StackScreenProps } from '@react-navigation/stack'
import World, { World } from './core/worldTools/World'

type RootStackParamList = {
  NewGame: undefined;
  Game: { world: World };
  Defeat: { years: number };
}

type NewGameProps = StackScreenProps<RootStackParamList, 'NewGame'>
type GameProps = StackScreenProps<RootStackParamList, 'Game'>
type DefeatProps = StackScreenProps<RootStackParamList, 'Defeat'>