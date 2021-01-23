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

import { styles, DEAD, WARRIORCLASSES, ENEMYCLASSES, QUESTS, CARDS } from '../core/consts'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import World from '../core/worldTools/World'

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

// MAIN GAME SCREEN
// Contains all the logic and game mechanics of the actual game

interface IState {
  world: World,
  modal: boolean,
  question: string
}

interface IProps {
  world: World,
  navigation: unknown,
  route: unknown
}
class Game extends React.Component<IProps, IState> {
  constructor (props) {
    super(props)
    // Fetch the world passed in from the generation
    const world = this.props.route.params.world

    // Expand this world into state so we have the entire class ready to go
    this.state = {
      world,
      modal: false,
      question: ''
    }
  }

  // Utility methods that help run certain game components and keep track of internal stats
  _calculateIncome (amount: number, totalCoin: number) {
    totalCoin += amount
    return totalCoin
  }

  _calculateHealth (amount: number) {
    if (this.state.world.health < 25) {
      const world = this.state.world
      world.health += amount
      this.setState({ world })
    }
  }

  _removeHealth (amount: number, totalHealth: number) {
    if (totalHealth - amount > 0) {
      return totalHealth - amount
    } else {
      this.props.navigation.push('Defeat', { years: this.state.world.years})
      return 0
    }
  }

  _calculatePeasants (amount: number) {
    const world = this.state.world
    world.pops += amount
    this.setState({ world })
  }

  _calculateLoot (amount: number, totalCoin: number) {
    const dice = amount * this._rollDice()
    return this._calculateIncome(Math.floor(dice * 0.5), totalCoin)
  }

  // Conduct "war" with the enemies and see who wins, whoever runs out of soliders first loses the battle
  _conductBattle () {
    const world = this.state.world

    if (world.currentEnemy === DEAD && world.enemycount > 0) {
      if (world.combatlevel < ENEMYCLASSES.length) {
        world.currentEnemy = ENEMYCLASSES[world.combatlevel]
      } else {
        world.currentEnemy = ENEMYCLASSES[1]
      }
    } else if (world.enemycount <= 0) {
      world.inBattle = false
      world.coin = this._calculateLoot(world.enemycount, world.coin)
      world.enemycount = 0
      this.setState({ world })
      return
    }

    if (world.currentWarrior === DEAD && world.warriors > 0) {
      if (world.warriorbuff > 0) {
        world.currentWarrior = WARRIORCLASSES[1]
        world.warriorbuff -= 1
      } else {
        world.currentWarrior = WARRIORCLASSES[0]
      }
    } else if (world.warriors <= 0) {
      world.inBattle = false
      world.enemycount = 0
      world.health = this._removeHealth(1, world.health)
      this.setState({ world })
      return
    }

    if (world.currentWarrior.damage * this._rollDice() < world.currentEnemy.damage * this._rollDice()) {
      if (world.duginhp > 0) {
        world.duginhp -= 1
      } else {
        world.currentWarrior = DEAD
        world.warriors -= 1
      }
    } else {
      world.currentEnemy = DEAD
      world.enemycount -= 1
    }

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

      if (world.combatlevel < ENEMYCLASSES.length) {
        world.currentEnemy = ENEMYCLASSES[world.combatlevel]
      } else {
        world.currentEnemy = ENEMYCLASSES[1]
      }

      if (world.warriorbuff > 0) {
        world.currentWarrior = WARRIORCLASSES[1]
      } else {
        world.currentWarrior = WARRIORCLASSES[0]
      }
    } else {
      world.coin = this._calculateIncome(Math.floor(0.5 * dice) + world.patronage, world.coin)
      world.pops += Math.floor(0.4 * dice)
    }

    this.setState({ world })
  }

  // Quest system, responsible for determining if a card is unlocked or not
  _createQuestQuestion () {
    const question = QUESTS[this.state.world.cardindex - 1]
    const dice = this._rollDice()

    if (dice > 3) {
      return question.response1
    } else {
      return question.response2
    }
  }

  // Processes the response via the user from the quest prompt
  _processQuestQuestion (response: boolean) {
    const world = this.state.world
    if (response) {
      if (world.cardindex < CARDS.length) {
        CARDS[world.cardindex].unlocked = true
        world.cardindex++
        this._runUI(false, world)
      }
    } else {
      this._runUI(false, world)
    }
  }

  // If a card is "played" then it will be processed WITHOUT moving the tick forward
  // This way the cards actually will have an effect ingame
  _conductCardAction (card) {
    const world = this.state.world
    switch (card.name) {
      case 'Guardian': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.warriors += 5
          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false, world)
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
          this._runUI(false, world)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Moo Mula': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.coin = this._calculateIncome(this._rollDice() * 2, world.coin)
          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false, world)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Dig In': {
        if (world.coin - card.cost >= 0) {
          world.coin -= card.cost
          world.duginhp += 5
          this._runUI(false, world)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Patronage': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.patronage += 1
          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false, world)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Arrow Storm': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          const dice = Math.floor(this._rollDice())
          if (world.enemycount - dice >= 0) {
            world.enemycount -= dice
          } else {
            world.enemycount = 0
          }

          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false, world)
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      // Straight up the most OP card
      case 'Kramdr': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          const dice = Math.floor(this._rollDice())
          world.coin = this._calculateIncome(dice * 4, world.coin)
          this._calculatePeasants(dice * 10)
          world.enemycount = 0
          world.coin -= card.cost
          world.pops -= card.popcost
          this._runUI(false, world)
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
  _runTick () {
    if (this.state.world.inBattle) {
      this._conductBattle()
    } else {
      this._conductPeace()
    }

    const world = this.state.world
    world.years += 1

    // Increases the seal level every 100 years
    if (world.years % 100 === 0) {
      if (world.seal.level < 6) {
        world.seal.level++
      }
    }

    // Increases the difficulty of combat every 200 years
    if (world.years % 200 === 0) {
      if (world.combatlevel < ENEMYCLASSES.length) {
        world.combatlevel += 1
        world.danger += 1
        Alert.alert('Sire! The enemies have gotten stronger... we better train better warriors!')
      }
    }

    // Runs a quest every 50 years
    if (world.years % 50 === 0) {
      if (world.cardindex < CARDS.length) {
        let question = this.state.question
        question = this._createQuestQuestion()
        this.setState({ question, modal: true })
      }
    }

    // Refresh the screen now that everything has been compiled for the next tick
    this.setState({ world })
  }

  // Runs a state update, but skips the tick. Used for UI updates before executing the next turn
  _runUI (modal: boolean, world: World) {
    this.setState({ world, modal: modal })
  }

  // Execute a tick
  _onPressButton () {
    this._runTick()
  }

  // Returns the UI for combat
  _returnCombatMenu () {
    const { inBattle, duginhp, enemycount, currentEnemy, currentWarrior} = this.state.world
    if (inBattle) {
      if (duginhp > 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons name='wall' size={32} />
              <MaterialCommunityIcons name={currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      } else if (duginhp === 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons color='red' name='wall' size={32} />
              <MaterialCommunityIcons name={currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {enemycount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons name={currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      }
    } else {
      return (
        <View style={styles.combatcontainer}>
          <MaterialCommunityIcons name='flower-tulip' color='#b197fc' size={32} />
          <Text style={styles.paragraph}>Our Kingdom is at Peace Sire! Your income can now be collected and peasants recruited.</Text>
        </View>
      )
    }
  }

  // Returns the seal of the kingdom based on the level and game
  _returnKingdomSeal () {
    const { seal } = this.state.world
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
    return CARDS
      .map((item) => {
        if (item.unlocked && item.popcost > 0) {
          return (
            // This should probably be in another class/component buuuuut
            <View>
              <TouchableOpacity onPress={() => this._conductCardAction(item)} style={styles.card}>
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
              <TouchableOpacity onPress={() => this._conductCardAction(item)} style={styles.card}>
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
      top: Dimensions.get('window').height / 2,
      bottom: 50
    }

    const { health, coin, warriors, pops, years } = this.state.world

    return (

      <View style={styles.container}>

        <View style={styles.toolbar}>
          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><Ionicons name='md-heart' size={32} color='red' />{health}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><MaterialCommunityIcons name='coin' size={32} color='gold' /> {coin}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><MaterialCommunityIcons name='shield-half-full' size={32} color='black' /> {warriors}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><Ionicons name='md-person' size={32} color='black' /> {pops}</Text>
          </View>
        </View>

        <Modal
          animationType='slide'
          transparent
          visible={this.state.modal}
        >
          <View style={styles.popupcontainer}>
            <View style={styles.popupinnercontainer}>
              <Text style={{ fontSize: 18, alignContent: 'center', padding: 5 }}>{this.state.question}</Text>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.toolbarbutton}>
                  <TouchableHighlight
                    onPress={() => this._processQuestQuestion(true)}
                    underlayColor='#c4c4c4'
                  >
                    <View style={styles.button}>
                      <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}>Yes</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.toolbarbutton}>
                  <TouchableHighlight
                    onPress={() => this._processQuestQuestion(false)}
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
          <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 5 }}>Years In Power: {years}</Text>

          {this._returnCombatMenu()}

          <View style={styles.toolbarbutton}>
            <TouchableHighlight
              onPress={() => this._onPressButton()}
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

export default Game
