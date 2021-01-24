// Additional Packages/Icons via NPM
import * as React from 'react'
import * as Animatable from 'react-native-animatable'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Audio } from 'expo-av'
import { styles } from '../core/consts'

import World from '../core/World'
import { NewGameProps } from '../types'

import {
  Text,
  View,
  TouchableHighlight
} from 'react-native'

class NewGame extends React.Component<NewGameProps> {
  constructor (props: NewGameProps) {
    super(props)

    this.state = {}
  }
  async startBackgroundAudio () {
    const { sound } = await Audio.Sound.createAsync(require('../assets/land.mp3'))
    this.setState({ backgroundAudio: sound })
    sound.playAsync()
  }

  componentDidMount () {
    this.startBackgroundAudio()
  }

  // Begins the game
  async startGame () {
    const world = new World()
    await this.state.backgroundAudio.stopAsync()
    this.props.navigation.push('Game', { world })
  }

  render () {
    return (
      <Animatable.View style={styles.container} animation='fadeIn' duration={1000} iterationCount={1} easing='ease-in'>
        <View style={styles.innercontainer}>
          <MaterialCommunityIcons name='sword-cross' size={65} />
          <Text style={styles.title}>
            KramdrQuest
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 30 }}>
            Developed by Jrreap 2019
          </Text>
          <Animatable.Text animation='fadeInLeft' delay={1000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>The pocket-sized adventure game</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={2000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Beginning generation...</Animatable.Text>
          <Animatable.Text animation='fadeInLeft' delay={4000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Rallying the soldiers...</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={6000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Collecting taxes...</Animatable.Text>
          <Animatable.Text animation='fadeInRight' delay={8000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Drawing seal...</Animatable.Text>
          <Animatable.Text animation='fadeInLeft' delay={10000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Done!</Animatable.Text>

          <TouchableHighlight
            onPress={() => this.startGame()}
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