import { StackScreenProps } from '@react-navigation/stack'
import World from './core/worldTools/World'

export type RootStackParamList = {
  NewGame: undefined
  Game: { world: World }
  Defeat: { years: number }
}

export type NewGameProps = StackScreenProps<RootStackParamList, 'NewGame'>
export type GameProps = StackScreenProps<RootStackParamList, 'Game'>
export type DefeatProps = StackScreenProps<RootStackParamList, 'Defeat'>

// Game types
export type KingdomSeal = { 
  icon: 'sword' | 'cupcake' | 'ship-wheel' | 'ubuntu' | 'cat' | 'castle'
  level: number
}

export type Unit = {
  name: string,
  health: number,
  damage: number,
  icon: string
}

export type Card = {
  name: string,
  description: string,
  icon: string,
  unlocked: boolean,
  id: number,
  cost: number,
  popcost: number,
}

export type Quest = {
  response1: string,
  response2: string,
  a1: boolean,
  a2: boolean
}