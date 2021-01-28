import { StyleSheet, Dimensions } from 'react-native'
import Constants from 'expo-constants'
import { Unit, Card, Quest } from '../types'

// weird errors happened when I tried to just have null be the "dead" state so I used this instead
export const DEAD: Unit = { name: 'dead', health: 0, damage: 1, icon: 'skull' }

// The classes of enemy warriors
export const ENEMYCLASSES: Unit[] = [
  { name: 'peasant', health: 10, damage: 1, icon: 'sword' },
  { name: 'beserker', health: 10, damage: 2, icon: 'axe' }
]

// The classes of soliders for the king's army
export const WARRIORCLASSES: Unit[] = [
  { name: 'peasant', health: 10, damage: 1, icon: 'feather' },
  { name: 'guard', health: 10, damage: 2, icon: 'shield-plus-outline' }
]

// Every card from the game and their stats
// The card ID is the index of them in this list, allows for ultra fast reads (instead of long loops over a potentially long list)
export const CARDS: Card[] = [
  { name: 'Guardian', description: 'Train more peasants into guards', icon: 'sword', unlocked: false, id: 1, cost: 5, popcost: 2 },
  { name: 'Moo Mula', description: 'Converting humans to money... what could go wrong!', icon: 'cow', unlocked: false, id: 2, cost: 0, popcost: 10 },
  { name: 'Dig In', description: 'Fortify the kingdom with walls!', icon: 'shovel', unlocked: false, id: 3, cost: 25, popcost: 0 },
  { name: 'Train', description: 'Give those guards some training!', icon: 'flag', unlocked: false, id: 4, cost: 10, popcost: 0 },
  { name: 'Patronage', description: 'Throw money at your peasants to make more money!', icon: 'artist', unlocked: false, id: 5, cost: 25, popcost: 1 },
  { name: 'Arrow Storm', description: 'Rain fire from above!', icon: 'bullseye-arrow', unlocked: false, id: 6, cost: 10, popcost: 0 },
  { name: 'Kramdr', description: 'Make things a little steamy...', icon: 'skull', unlocked: false, id: 7, cost: 200, popcost: 100 }
]

// Quest responses, these are directly related to the card at the same index in the cards array
// Each has a few different variations so people don't just memorize the quests/actions
export const QUESTS: Quest[] = [
  {
    response1: 'Sir a strange man has appeared at our gates saying he wishes to buy some of our peasants from us... should we let him?',
    response2: 'Sire! Your royal magicians have discovered a way to turn peasants into coin! Should we let them?',
    a1: true,
    a2: true
  },
  {
    response1: 'One of our peasants found a giant stone outside, during the attack he managed to hide behind it for safety... maybe this could be used for our troops?',
    response2: 'Sire! Some crazy dude thought it might be smart to build a wall in front of the troops... can you imagine that?',
    a1: true,
    a2: true
  },
  {
    response1: 'Some dude showed up and said we should train our soilders, despite our troops having the best of pitchforks. We could prepare a neq training method if you so choose sire.',
    response2: 'Troops are starting to complain that they are dropping like flies... I say we just kill them all.',
    a1: true,
    a2: false
  },
  {
    response1: 'Permission to chuck money at our peasants?',
    response2: 'Sire! Our research team has discovered if you give peasants money they actually SPEND it. Crazy right? Should we start giving the peasants money?',
    a1: true,
    a2: true
  },
  {
    response1: "Our archers are upset they don't get to do anything... should we let them vent their anger on the enemy?",
    response2: 'Our archers seem to want to just ranomly kill things... which is a problem. Should we let them just kill the enemy forces?',
    a1: true,
    a2: true
  },
  {
    response1: 'So this crazy dude appeared at our gates. He says hes like a... computer teacher, whatever that is. Should we let him in?',
    response2: 'Sire! Some guy is stealing all our food! Should we stop him?',
    a1: true,
    a2: false
  }
]

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  popupcontainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  popupinnercontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    backgroundColor: '#c4c4c4'
  },
  cardcontainer: {
    flex: 1,
    padding: 10,
    maxHeight: 280
  },
  researchCardContainer : {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 280
  },
  actioncontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    maxHeight: 60
  },
  combatcontainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  combatinnercontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 50,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innercontainer: {
    flex: 10,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    alignItems: 'center'
  },
  carddeck: {
  },
  card: {
    width: 120,
    height: 170,
    backgroundColor: '#c1c1c1',
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center'
  },
  spacer: {
    width: 15
  },
  toolbar: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#c4c4c4',
    borderColor: 'black',
    flexDirection: 'row'
  },
  toolbarbutton: {
    justifyContent: 'center',
    padding: 10
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  },
  header: {
    margin: 24,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  counter: {
    fontSize: 30
  },
  button: {
    width: 120,
    height: 45,
    backgroundColor: '#4286f4',
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center'
  },
  actionButton: {
    width: 175,
    height: 45,
    backgroundColor: '#4286f4',
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center'
  }
})