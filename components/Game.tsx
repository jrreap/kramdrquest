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

import { styles, ENEMYCLASSES } from '../core/consts'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { Card, GameProps } from '../types'
import { World, Combat, Economy, CardDeck, Research } from '../core'

import CombatMenu from './Game/CombatMenu'
import KingdomSeal from './Game/KingdomSeal'

interface IState {
  modal: boolean,
  question: string,
  researchOptions: Card[]
}

class Game extends React.Component<GameProps, IState> {

  world : World
  combat : Combat
  economy: Economy
  deck: CardDeck
  research : Research

  constructor (props : GameProps) {
    super(props)
    // Fetch the world passed in from the generation
    // We keep it out of state since the actual world instance remains constant
    this.world = this.props.route.params.world ?? undefined

    // Aspects of the world that build on the base data from the kingdom
    this.economy = new Economy(this.world)
    this.combat = new Combat(this.world, this.economy)
    this.deck = new CardDeck(this.world, this.economy)
    this.research = new Research(this.deck)

    this.state = {
      modal: false,
      question: '',
      researchOptions: this.research.drawAvailableResearch()
    }

    this.nextTurn = this.nextTurn.bind(this)
  }

  nextTurn () {
    if (this.world.inBattle) {
      const isAlive = this.combat.conductBattle()
      if (!isAlive) {
        this.props.navigation.push('Defeat', {years: this.world.years})
      }
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

    // Completes a research at a base of 50 years, factoring in research speed
    if (Math.floor(this.world.years % (50 / this.world.researchSpeed)) === 0) {
      if (this.research.isResearching) {
        this.research.attemptResearch()
        Alert.alert('Successfully completed research!')
        this.setState({ researchOptions: this.research.drawAvailableResearch()})
      } else {
        Alert.alert('You currently have no selected research! Make sure to select one!')
        this.setState({})
      }
      return
    }

    // Refresh the screen now that everything has been compiled for the next tick
    this.setState({})
  }

  activateCard (card : Card) {
    this.deck.playCard(card)
    this.setState({})
  }

  // Maps out and renders each card that is unlocked in the deck
  renderCardDeck (deck : Card[]) {
    return deck
      .map((item) => {
        if (item.popcost > 0) {
          return (
            <View key={item.name}>
              <TouchableOpacity onPress={() => this.activateCard(item)} style={styles.card}>
                <View style={{ paddingBottom: 5, justifyContent: 'center' }}>
                  <MaterialCommunityIcons style={{ alignSelf: 'center' }} name={item.icon} color='black' size={32} />
                  <Text style={{ fontSize: 25, alignSelf: 'center', padding: 5 }}>{item.name}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, alignSelf: 'center', padding: 5 }}>{item.desc}</Text>
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
        } else {
          return (
            <View key={item.name}>
              <TouchableOpacity onPress={() => this.activateCard(item)} style={styles.card}>
                <View style={{ paddingBottom: 5, justifyContent: 'center' }}>
                  <MaterialCommunityIcons style={{ alignSelf: 'center' }} name={item.icon} color='black' size={32} />
                  <Text style={{ fontSize: 25, alignSelf: 'center', padding: 5 }}>{item.name}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, alignSelf: 'center', padding: 5 }}>{item.desc}</Text>
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
  processCardDeck () {
    let i = 1
    const data = this.renderCardDeck(this.deck.getDeck())
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
              <Text style={{ fontSize: 18, alignContent: 'center', padding: 5 }}>Sire! We have 3 possible directions of research. What new tech do you wish us to start working on?</Text>
              <View style={styles.cardcontainer}>
                  {this.renderCardDeck(this.state.researchOptions)}
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.innercontainer}>

          <KingdomSeal world={this.world} />

          <Text style={styles.header}>
            KramdrQuest
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 5 }}>Years In Power: {years}</Text>

          <CombatMenu world={this.world} />

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
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Kingdom Cards</Text>
                </TouchableOpacity>
                <View style={styles.cardcontainer}>
                  <Text>This is the card deck, tap a card to use it to help keep your kingdom under control!</Text>
                  <ScrollView contentContainerStyle={{ padding: 5, justifyContent: 'space-between' }} style={styles.carddeck} horizontal>

                    {this.processCardDeck()}

                  </ScrollView>
                </View>
                <View style={styles.actioncontainer}>
                  <TouchableHighlight
                    onPress={() => {this.setState({modal: true})}}
                    underlayColor='#c4c4c4'
                  >
                    <View style={styles.actionButton}>
                      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingLeft: 5 }}>Select Research</Text>
                    </View>
                  </TouchableHighlight>
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
