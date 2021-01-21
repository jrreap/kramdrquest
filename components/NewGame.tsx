// Additional Packages/Icons via NPM
import * as React from 'react'
import * as Animatable from 'react-native-animatable'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { rollDice } from '../core/utils'

class NewGame extends React.Component {
  componentDidMount () {
    if (i === 0) {
      this._soundMain()
    }
    i++
  }

  // Loads in and starts the audio playback for the game
  async _soundMain () {
    try {
      await audio.loadAsync(require('./assets/land.mp3'))
      await audio.playAsync()
    } catch (error) {
      console.log(error)
    }

    try {
      await mainaudio.loadAsync(require('./assets/bluearcher.mp3'), { isLooping: true })
    } catch (error) {
      console.log(error)
    }
  }

  // Generate the "world" you start in, maybe you'll get a few extra gold or maybe more soilders to defend your kingdom with
  // For some reason on my phone it would occasionally not run fast enough... probably because of animations so there is a "loading sequence"
  // to help stall :)
  _generateWorld () {
    // Make sure everything is set to default
    _warriors = 10
    _health = 3
    _coin = 10
    _pops = 25
    _years = 1

    inBattle = false
    _enemycount = 0
    _currentWarrior = null
    _currentEnemy = null
    _notdead = true

    // Create the kingdom seal
    switch (rollDice()) {
      case (1): {
        seal.icon = 'sword'
        break
      }
      case (2): {
        seal.icon = 'cupcake'
        break
      }
      case (3): {
        seal.icon = 'ship-wheel'
        break
      }
      case (4): {
        seal.icon = 'ubuntu'
        break
      }
      case (5): {
        seal.icon = 'cat'
        break
      }
      case (6): {
        seal.icon = 'castle'
        break
      }
    }

    // Now to vary the world a bit for different play styles
    _coin += rollDice() * rollDice()
    _warriors += Math.floor(rollDice() * 1.5)
    _pops += Math.floor(rollDice() * 0.8)
  }

  // Begins the game
  _pressButton () {
    audio.stopAsync()

    mainaudio.playAsync()

    this.props.navigation.navigate('Game')
  }

  render () {
    this._generateWorld()

    return (
      <Animatable.View style={styles.container} animation='fadeIn' duration={1000} iterationCount={1} easing='ease-in'>
        <View style={styles.innercontainer}>
          <MaterialCommunityIcons name='sword-cross' size={65} />
          <Text style={styles.title}>
            KramdrQuest
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 30 }}>
            Developed by Jaydon Reap 2019
          </Text>
          <Animatable.Text animation='fadeInLeft' delay={1000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>The pocket-sized adventure game</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={2000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Beginning generation...</Animatable.Text>
          <Animatable.Text animation='fadeInLeft' delay={4000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Rallying the soldiers...</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={6000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Collecting taxes...</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={8000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Drawing seal...</Animatable.Text>
          <Animatable.Text animation='fadeInLeft' delay={10000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Done!</Animatable.Text>

          <TouchableHighlight
            onPress={() => this._pressButton()}
            underlayColor='#c4c4c4'
          >
            <Animatable.View animation='fadeInUp' delay={11000} style={styles.button}>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingLeft: 5 }}>Begin</Text>
            </Animatable.View>
          </TouchableHighlight>

        </View>
      </Animatable.View>
    )
  }
}

export default NewGame