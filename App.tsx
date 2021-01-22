import * as React from 'react'
import {
  Text,
  View,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native'

import { styles } from './core/consts'
import NewGame from './components/NewGame'

/*
          ======= KRAMDRQUEST =======
        The pocket sized adventure game
        Developed by Jrreap (2019)
                Version 0.0.1

              ----Features----
      - Card deck system
      - Quest system to unlock new cards
      - Enemy and Warrior class system
      - Combat system
      - Special card buff system
      - Economy system, complete with 4 resources
      - "World" generation
      - Kingdom progression (seal levels)
      - Defeat screen
      - Music!
      - Animations
      - Straight up amazing game :)

*/

// Word of warning yes I know some of this stuff should be in other components (its react best practices after all)
// it was simply easier to just keep everything in one file for now so I didn't have to mess with props... so yeah be warned!


// Additional Packages/Icons via NPM
import * as Animatable from 'react-native-animatable'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { createAppContainer, createStackNavigator, NavigationProp } from 'react-navigation'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import World from './core/worldTools/World'

let _question = ' '

// weird errors happened when I tried to just have null be the "dead" state so I used this instead
const deadenemy = { name: 'dead', health: 0, damage: 1, icon: 'skull' }

// The classes of enemy warriors
const enemyclasses = [
  { name: 'peasant', health: 10, damage: 1, icon: 'sword' },
  { name: 'beserker', health: 10, damage: 2, icon: 'axe' }
]

// The classes of soilders for the king's army
const warriorclasses = [
  { name: 'peasant', health: 10, damage: 1, icon: 'feather' },
  { name: 'guard', health: 10, damage: 2, icon: 'shield-plus-outline' }
]

// Every card from the game and their stats
const cards = [
  { name: 'Guardian', description: 'Train more peasants into guards', icon: 'sword', unlocked: true, id: 1, cost: 5, popcost: 2 },
  { name: 'Moo Mula', description: 'Converting humans to money... what could go wrong!', icon: 'cow', unlocked: false, id: 2, cost: 0, popcost: 10 },
  { name: 'Dig In', description: 'Fortify the kingdom with walls!', icon: 'shovel', unlocked: false, id: 3, cost: 25, popcost: 0 },
  { name: 'Train', description: 'Give those guards some training!', icon: 'flag', unlocked: false, id: 4, cost: 10, popcost: 0 },
  { name: 'Patronage', description: 'Throw money at your peasants to make more money!', icon: 'artist', unlocked: false, id: 5, cost: 25, popcost: 1 },
  { name: 'Arrow Storm', description: 'Rain fire from above!', icon: 'bullseye-arrow', unlocked: false, id: 6, cost: 10, popcost: 0 },
  { name: 'Kramdr', description: 'Make things a little steamy...', icon: 'skull', unlocked: false, id: 7, cost: 200, popcost: 100 }
]

// Quest responses, these are directly related to the card at the same index in the cards array
// Each has a few different variations so people don't just memorize the quests/actions
const quests = [
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

// Defeat screen, if you die this is where you go
/* 
class Defeat extends React.Component {
  // Rolls a "dice" to help in adding some chance to the game
  _rollDice () {
    return Math.floor((Math.random() * 6) + 1)
  }

  // Calculates the end game stats
  _calcStats () {
    const stats = []
    let i
    let c = 0
    for (i = 0; i < cards.length; i++) {
      if (cards[i].unlocked) {
        c++
      }
    }

    // Did you discover the special Kramdr card?
    if (cards[cards.length - 1].unlocked) {
      stats[1] = true
    }

    stats[0] = c

    return stats
  }

  _renderKramdr (stats) {
    if (stats[1]) {
      return (
        <View>
          <Animatable.Image animation='fadeInUp' delay={2000} style={{ width: 200, height: 300, padding: 10, alignSelf: 'center', borderRadius: 10 }} source={require('./assets/wonder.png')} />
          <Animatable.Text animation='fadeInUp' delay={2000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Quite thoughtful isnt he?</Animatable.Text>
        </View>
      )
    } else {
      return (
        <Animatable.Text animation='fadeInUp' delay={2000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>The great Kramdr has eluded you...</Animatable.Text>
      )
    }
  }

  render () {
    const stats = this._calcStats()

    return (
      <Animatable.View style={styles.container} animation='fadeIn' duration='1000' iterationCount={1} easing='ease-in'>
        <View style={styles.innercontainer}>
          <MaterialCommunityIcons name='flag-outline' size={65} />
          <Text style={styles.title}>
            The Kingdom Has Fallen
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 30 }}>
            Years In Power: {_years}
          </Text>
          <Animatable.Text animation='fadeInLeft' delay={1000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Cards discovered: {stats[0]}</Animatable.Text>

          {this._renderKramdr(stats)}

          <TouchableHighlight
            style={{ paddingTop: 10 }}
            onPress={() => {
              this.props.navigation.navigate('NewGameScreen')
            }}
            underlayColor='#c4c4c4'
          >
            <Animatable.View animation='fadeInUp' delay='3000' style={styles.button}>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingLeft: 5 }}>Retry?</Text>
            </Animatable.View>
          </TouchableHighlight>

        </View>
      </Animatable.View>
    )
  }
} */

// MAIN GAME SCREEN
// Contains all the logic and game mechanics of the actual game

interface IProps {
  world: World
}

interface IState {
  world: World
}
class Home extends React.Component<IState, IProps> {
  constructor (props) {
    super(props)
    this.state = {
      world: this.props.navigation.getParam('world', null)
    }
  }

  // Utility methods that help run certain game components and keep track of internal stats
  _calculateIncome (amount: number) {
    const world = this.state.world
    world.coin += amount
    this.setState({ world })
  }

  _calculateHealth (amount: number) {
    if (this.state.world.health < 25) {
      this.state.world.health += amount
    }
  }

  _removeHealth (amount: number) {
    const world = this.state.world
    if (world.health - amount > 0) {
      world.health -= amount
    } else {
      this.props.navigation.navigate('Defeat')
    }
  }

  _calculateWarriors (amount: number) {
    const world = this.state.world
    world.warriors += amount
    this.setState({ world })
  }

  _calculatePeasants (amount: number) {
    const world = this.state.world
    world.pops += amount
    this.setState({ world })
  }

  _calculateLoot (amount: number) {
    const dice = amount * this._rollDice()
    this._calculateIncome(Math.floor(dice * 0.5))
  }

  // Conduct "war" with the enemies and see who wins, whoever runs out of soliders first loses the battle
  _conductBattle () {
    let { currentEnemy, currentWarrior, enemycount, combatlevel, inBattle, warriors, warriorbuff, duginhp } = this.state.world
    if (currentEnemy === deadenemy && enemycount > 0) {
      if (combatlevel < enemyclasses.length) {
        currentEnemy = enemyclasses[combatlevel]
      } else {
        currentEnemy = enemyclasses[1]
      }
    } else if (enemycount <= 0) {
      inBattle = false
      this._calculateLoot(enemycount)
      enemycount = 0
      return
    }

    if (currentWarrior === deadenemy && warriors > 0) {
      if (warriorbuff > 0) {
        currentWarrior = warriorclasses[1]
        warriorbuff -= 1
      } else {
        currentWarrior = warriorclasses[0]
      }
    } else if (warriors <= 0) {
      inBattle = false
      enemycount = 0
      this._removeHealth(1)
      return
    }

    if (currentWarrior.damage * this._rollDice() < currentEnemy.damage * this._rollDice()) {
      if (duginhp > 0) {
        duginhp -= 1
      } else {
        currentWarrior = deadenemy
        this._calculateWarriors(-1)
      }
    } else {
      currentEnemy = deadenemy
      enemycount -= 1
    }

    const world = this.state.world
    world.enemycount  = enemycount
    world.currentEnemy = currentEnemy
    world.currentWarrior = currentWarrior
    world.combatlevel = combatlevel
    world.inBattle = inBattle
    world.warriors = warriors
    world.warriorbuff = warriorbuff
    world.duginhp = duginhp

    this.setState({ world })
  }

  // If the kingdom is at peace, collect income and increase the population
  _conductPeace () {
    const dice = this._rollDice()
    const world = this.state.world

    if (this._rollInBattleDice() >= 19) {
      Alert.alert('Enemies are approaching sire! To arms!')
      world.inBattle = true
      world.enemycount += (this._rollDice() * dice) * world.danger

      if (world.combatlevel < enemyclasses.length) {
        world.currentEnemy = enemyclasses[combatlevel]
      } else {
        world.currentEnemy = enemyclasses[1]
      }

      if (world.warriorbuff > 0) {
        world.currentWarrior = warriorclasses[1]
      } else {
        world.currentWarrior = warriorclasses[0]
      }
    } else {
      this._calculateIncome(Math.floor(0.5 * dice) + world.patronage)
      world.pops += Math.floor(0.4 * dice)
    }

    this.setState({ world })
  }

  // Quest system, responsible for determining if a card is unlocked or not
  _createQuestQuestion () {
    const world = this.state.world
    const question = quests[world.cardindex - 1]
    const dice = this._rollDice()

    if (dice > 3) {
      return question.response1
    } else {
      return question.response2
    }
  }

  // Processes the response via the user from the quest prompt
  _processQuestQuestion (response) {
    const world = this.state.world
    if (response) {
      if (world.cardindex < cards.length) {
        cards[world.cardindex].unlocked = true
        world.cardindex++
        this.setState({ world })
        this._runUI(false)
      }
    } else {
      this.setState({ world })
      this._runUI(false)
    }
  }

  // If a card is "played" then it will be processed WITHOUT moving the tick forward
  // This way the cards actually will have an effect ingame
  _conductCardAction (card) {
    const world = this.state.world
    switch (card.name) {
      case 'Guardian': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          this._calculateWarriors(5)
          world.coin -= card.cost
          world.pops -= card.popcost
          this.setState({ world })
          this._runUI(false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Train': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.warriorbuff += 5
          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Moo Mula': {
        if (_coin - card.cost >= 0 && _pops - card.popcost >= 0) {
          this._calculateIncome(this._rollDice() * 2)
          _coin -= card.cost
          _pops -= card.popcost
          this._runUI(state, false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Dig In': {
        if (_coin - card.cost >= 0) {
          _coin -= card.cost
          duginhp += 5
          this._runUI(state, false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Patronage': {
        if (_coin - card.cost >= 0 && _pops - card.popcost >= 0) {
          patronage += 1
          _coin -= card.cost
          _pops -= card.popcost
          this._runUI(state, false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Arrow Storm': {
        if (_coin - card.cost >= 0 && _pops - card.popcost >= 0) {
          const dice = Math.floor(this._rollDice())
          if (_enemycount - dice >= 0) {
            _enemycount -= dice
          } else {
            _enemycount = 0
          }

          _coin -= card.cost
          _pops -= card.popcost
          this._runUI(state, false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      // Straight up the most OP card
      case 'Kramdr': {
        if (_coin - card.cost >= 0 && _pops - card.popcost >= 0) {
          const dice = Math.floor(this._rollDice())
          this._calculateIncome(dice * 4)
          this._calculatePeasants(dice * 10)
          _enemycount = 0
          _coin -= card.cost
          _pops -= card.popcost
          this._runUI(state, false)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
    }
  }

  // Rolls a "dice" to help in adding some chance to the game
  _rollDice () {
    return Math.floor((Math.random() * 6) + 1)
  }

  // Special version of the dice role to calculate a 1 to 20 roll
  _rollInBattleDice () {
    return Math.floor((Math.random() * 20) + 1)
  }

  // My makeshift loop to update game things every turn (which I will refer to as a 'tick')
  _runTick (state) {
    if (inBattle) {
      this._conductBattle()
    } else {
      this._conductPeace()
    }

    _years += 1

    // Increases the seal level every 100 years
    if (_years % 100 === 0) {
      if (seal.level < 6) {
        seal.level++
      }
    }

    // Increases the difficulty of combat every 200 years
    if (_years % 200 === 0) {
      if (combatlevel < enemyclasses.length) {
        combatlevel += 1
        danger += 1
        Alert.alert('Sire! The enemies have gotten stronger... we better train better warriors!')
      }
    }

    // Runs a quest every 50 years
    if (_years % 50 === 0) {
      if (cardindex < cards.length) {
        _question = this._createQuestQuestion()
        this._runUI(state, true)
      }
    }

    // Refresh the screen now that everything has been compiled for the next tick
    this.setState(() => ({ warriors: _warriors, coin: _coin, health: _health, pops: _pops, enemies: _enemycount, years: _years }))
  }

  // Runs a state update, but skips the tick. Used for UI updates before executing the next turn
  _runUI (state, modal) {
    this.setState(() => ({ warriors: _warriors, coin: _coin, health: _health, pops: _pops, enemies: _enemycount, years: _years, modal: modal }))
  }

  // Execute a tick
  _onPressButton (state) {
    this._runTick(state)
  }

  // Returns the UI for combat
  _returnCombatMenu () {
    if (inBattle) {
      if (duginhp > 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {_enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={_currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons name='wall' size={32} />
              <MaterialCommunityIcons name={_currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      } else if (duginhp === 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {_enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={_currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons color='red' name='wall' size={32} />
              <MaterialCommunityIcons name={_currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {_enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={_currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons name={_currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      }
    } else {
      return (
        <View style={styles.combatcontainer}>
          <MaterialCommunityIcons name='flower-tulip' color='#b197fc' size={32} />
          <Text style={styles.paragraph}>Our Kingom is at Peace Sire! Your income can now be collected and peasants recruited.</Text>
        </View>
      )
    }
  }

  // Returns the seal of the kingdom based on the level and game
  _returnKingdomSeal () {
    switch (seal.level) {
      case (0): {
        return (
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={seal.icon} size={65} />
          </View>
        )
      }
      case (1): {
        return (
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} name={seal.icon} size={65} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
          </View>
        )
      }
      case (2): {
        return (
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} name={seal.icon} size={65} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
          </View>
        )
      }
      case (3): {
        return (
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} name={seal.icon} size={65} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
          </View>
        )
      }
      case (4): {
        return (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} color='red' name={seal.icon} size={65} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            </View>
          </View>
        )
      }
      case (5): {
        return (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} color='red' name={seal.icon} size={65} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='medal' size={35} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='star-circle-outline' size={35} />
            </View>
          </View>
        )
      }
      case (6): {
        return (
          <View>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='red' name='crown' size={45} />
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='trophy-outline' size={35} />
              <MaterialCommunityIcons style={{ padding: 5, alignSelf: 'center' }} color='red' name={seal.icon} size={65} />
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} color='gold' name='trophy-outline' size={35} />
            </View>
          </View>
        )
      }
    }
  }

  // Maps out and renders each card that is unlocked in the deck
  _renderCardDeck () {
    const spacer = <View style={styles.spacer} />
    return cards
      .map((item) => {
        if (item.unlocked && item.popcost > 0) {
          return (
            // This should probably be in another class/component buuuuut
            <View>
              <TouchableOpacity onPress={(state) => this._conductCardAction(state, item)} style={styles.card}>
                <View style={{ paddingBottom: 5, justifyContent: 'center' }}>
                  <MaterialCommunityIcons style={{ alignSelf: 'center' }} name={item.icon} color='black' size={32} />
                  <Text style={{ fontSize: 25, alignSelf: 'center', padding: 5 }}>{item.name}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, alignSelf: 'center', padding: 5 }}>{item.description}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name='coin' color='gold' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.cost}</Text>
                <Ionicons style={{ paddingLeft: 5 }} name='md-person' color='black' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.popcost}</Text>
              </View>
            </View>
          )
        } else if (item.unlocked) {
          return (
            <View>
              <TouchableOpacity onPress={(state) => this._conductCardAction(state, item)} style={styles.card}>
                <View style={{ paddingBottom: 5, justifyContent: 'center' }}>
                  <MaterialCommunityIcons style={{ alignSelf: 'center' }} name={item.icon} color='black' size={32} />
                  <Text style={{ fontSize: 25, alignSelf: 'center', padding: 5 }}>{item.name}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, alignSelf: 'center', padding: 5 }}>{item.description}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name='coin' color='gold' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.cost}</Text>
              </View>
            </View>
          )
        }
      })
  }

  // Adds in spacers to the array to make the deck look a bit fancier
  _processCardDeck () {
    let i = 0
    const spacer = <View style={styles.spacer} />
    const data = this._renderCardDeck()
    while (i <= data.length) {
      data.splice(i, 0, spacer)
      i += 2
    }

    return data
  }

  render () {
    const draggableRange = {
      top: deviceheight / 2,
      bottom: 50
    }

    return (

      <View style={styles.container}>

        <View style={styles.toolbar}>
          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><Ionicons name='md-heart' size={32} color='red' />{_health}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><MaterialCommunityIcons name='coin' size={32} color='gold' /> {_coin}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><MaterialCommunityIcons name='shield-half-full' size={32} color='black' /> {_warriors}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><Ionicons name='md-person' size={32} color='black' /> {_pops}</Text>
          </View>
        </View>

        <Modal
          animationType='slide'
          transparent
          visible={this.state.modal}
        >
          <View style={styles.popupcontainer}>
            <View style={styles.popupinnercontainer}>
              <Text style={{ fontSize: 18, alignContent: 'center', padding: 5 }}>{_question}</Text>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.toolbarbutton}>
                  <TouchableHighlight
                    onPress={(state) => this._processQuestQuestion(state, true)}
                    underlayColor='#c4c4c4'
                  >
                    <View style={styles.button}>
                      <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}>Yes</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.toolbarbutton}>
                  <TouchableHighlight
                    onPress={(state) => this._processQuestQuestion(state, false)}
                    underlayColor='#c4c4c4'
                  >
                    <View style={styles.button}>
                      <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}>No</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.innercontainer}>

          {this._returnKingdomSeal()}

          <Text style={styles.header}>
            KramdrQuest
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 5 }}>Years In Power: {_years}</Text>

          {this._returnCombatMenu()}

          <View style={styles.toolbarbutton}>
            <TouchableHighlight
              onPress={state => this._onPressButton(state)}
              underlayColor='#c4c4c4'
            >
              <View style={styles.button}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingLeft: 5 }}>Next Turn</Text>
              </View>
            </TouchableHighlight>
          </View>

          <SlidingUpPanel draggableRange={draggableRange} ref={c => this._panel = c}>
            {dragHandler => (
              <View style={styles.panel}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._panel.show()} style={styles.panelHeader}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Card Deck</Text>
                </TouchableOpacity>
                <View style={styles.cardcontainer}>
                  <Text>This is the card deck, tap a card to use it to help keep your kingdom under control!</Text>
                  <ScrollView contentContainerStyle={{ padding: 5, justifyContent: 'space-between' }} style={styles.carddeck} horizontal>

                    {this._processCardDeck()}

                  </ScrollView>
                </View>
              </View>
            )}
          </SlidingUpPanel>

        </View>
      </View>
    )
  }
}

// SCREEN CONTROLLER/APP OUTPUT
const AppNavigator = createStackNavigator(
  {
    Game: Home,
    NewGameScreen: NewGame
  },
  {
    initialRouteName: 'NewGameScreen',
    headerMode: 'none'
  }
)

// Actually export the app for react native
export default createAppContainer(AppNavigator)
