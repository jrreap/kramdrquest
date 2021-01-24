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

import { styles, ENEMYCLASSES, QUESTS, CARDS } from '../core/consts'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { Card, GameProps } from '../types'
import { rollDice } from '../core/utils'
import World from '../core/World'
import Combat from '../core/Combat'

interface IState {
  modal: boolean,
  question: string
}

class Game extends React.Component<GameProps, IState> {

  world : World
  combat : Combat

  constructor (props : GameProps) {
    super(props)
    // Fetch the world passed in from the generation
    // We keep it out of state since the actual world instance remains constant
    this.world = this.props.route.params.world ?? undefined
    this.combat = new Combat(this.world)

    this.state = {
      modal: false,
      question: ''
    }

    this.nextTurn = this.nextTurn.bind(this)
  }

  // Quest system, responsible for determining if a card is unlocked or not
  _createQuestQuestion () {
    const question = QUESTS[this.world.cardIndex - 1]
    const dice = rollDice()

    if (dice > 3) {
      return question.response1
    } else {
      return question.response2
    }
  }

  // Processes the response via the user from the quest prompt
  _processQuestQuestion (response: boolean) {
    const world = this.world
    if (response) {
      if (world.cardIndex < CARDS.length) {
        CARDS[world.cardIndex].unlocked = true
        world.cardIndex++
        this.setState({ modal: false})
      }
    } else {
      this.setState({ modal: false})
    }
  }

  // If a card is "played" then it will be processed WITHOUT moving the tick forward
  // This way the cards actually will have an effect ingame
  _conductCardAction (card: Card) {
    const world = this.world
    switch (card.name) {
      case 'Guardian': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.warriors += 5
          world.coin -= card.cost
          world.pops -= card.popcost
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Train': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.warriorBuff += 5
          world.coin -= card.cost
          world.pops -= card.popcost
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Moo Mula': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          world.calculateIncome(2)
          world.coin -= card.cost
          world.pops -= card.popcost
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Dig In': {
        if (world.coin - card.cost >= 0) {
          world.coin -= card.cost
          world.fortifications += 5
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
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      case 'Arrow Storm': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          const dice = Math.floor(rollDice())
          if (world.enemyCount - dice >= 0) {
            world.enemyCount -= dice
          } else {
            world.enemyCount = 0
          }

          world.coin -= card.cost
          world.pops -= card.popcost
          break
        } else {
          Alert.alert('Sire! We do not have enough for that!')
          break
        }
      }
      // Straight up the most OP card
      case 'Kramdr': {
        if (world.coin - card.cost >= 0 && world.pops - card.popcost >= 0) {
          const dice = Math.floor(rollDice())
          world.calculateIncome(4)
          world.pops += dice * 10
          world.enemyCount = 0
          world.coin -= card.cost
          world.pops -= card.popcost
        } else {
          Alert.alert('Sire! We do not have enough for that!')
        }
        break
      }
    }

    // Trigger a refresh... will not be needed once things are broken into smaller components
    // Props would then trigger rerendering without state!
    this.setState({})
  }

  // My makeshift loop to update game things every turn (which I will refer to as a 'tick')
  nextTurn () {
    if (this.world.inBattle) {
      this.combat.conductBattle()
    } else {
      this.combat.conductPeace()
    }

    this.world.years += 1

    // Increases the seal level every 100 years
    if (this.world.years % 100 === 0) {
      if (this.world.seal.level < 6) {
        this.world.seal.level++
      }
    }

    // Increases the difficulty of combat every 200 years
    if (this.world.years % 200 === 0) {
      if (this.world.combatLevel < ENEMYCLASSES.length) {
        this.world.increaseDifficultyLevel()
        Alert.alert('Sire! The enemies have gotten stronger... we better train better warriors!')
      }
    }

    // Runs a quest every 50 years
    if (this.world.years % 50 === 0) {
      if (this.world.cardIndex < CARDS.length) {
        let question = this.state.question
        question = this._createQuestQuestion()
        this.setState({ question, modal: true })
      }
    }

    // Refresh the screen now that everything has been compiled for the next tick
    this.setState({})
  }

  // Returns the UI for combat
  _returnCombatMenu () {
    const { inBattle, fortifications, enemyCount, currentEnemy, currentWarrior} = this.world
    if (inBattle) {
      if (fortifications > 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {enemyCount}</Text>
            <View style={styles.combatinnercontainer}>
              <MaterialCommunityIcons name={currentEnemy.icon} size={32} />
              <Text style={{ padding: 10 }}>VS</Text>
              <MaterialCommunityIcons name='wall' size={32} />
              <MaterialCommunityIcons name={currentWarrior.icon} size={32} />
            </View>
          </View>
        )
      } else if (fortifications === 1) {
        return (
          <View style={styles.combatcontainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>In Combat!</Text>
            <Text>Enemy Strength: {enemyCount}</Text>
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
            <Text>Enemy Strength: {enemyCount}</Text>
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
    const { seal } = this.world
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
      .map((item, index) => {
        if (item.unlocked && item.popcost > 0) {
          return (
            <View key={index}>
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
                <FontAwesome5 name='coins' color='gold' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.cost}</Text>
                <Ionicons style={{ paddingLeft: 5 }} name='md-person' color='black' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.popcost}</Text>
              </View>
            </View>
          )
        } else if (item.unlocked) {
          return (
            <View key={index}>
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
                <FontAwesome5 name='coins' color='gold' size={32} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 3 }}>{item.cost}</Text>
              </View>
            </View>
          )
        }
      })
  }

  // Adds in spacers to the array to make the deck look a bit fancier
  _processCardDeck () {
    let i = 1
    const data = this._renderCardDeck()
    while (i <= data.length) {
      data.splice(i, 0, <View key={i} style={styles.spacer} />)
      i += 2
    }

    return data
  }

  render () {
    const draggableRange = {
      top: Dimensions.get('window').height / 2,
      bottom: 50
    }

    const { health, coin, warriors, pops, years } = this.world

    return (

      <View style={styles.container}>

        <View style={styles.toolbar}>
          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><Ionicons name='md-heart' size={32} color='red' />{health}</Text>
          </View>

          <View style={styles.toolbarbutton}>
            <Text style={styles.counter}><FontAwesome5 name='coins' size={32} color='gold' /> {coin}</Text>
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
              onPress={this.nextTurn}
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
