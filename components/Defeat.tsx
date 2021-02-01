import * as React from 'react'
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native'

import { styles, CARDS } from '../core/consts'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'

import { DefeatProps } from '../types'

// Defeat screen, if you die this is where you go
class Defeat extends React.Component<DefeatProps> {
  render () {
    const unlockedCards = this.props.route.params.cards
    return (
      <Animatable.View style={styles.container} animation='fadeIn' duration='1000' iterationCount={1} easing='ease-in'>
        <View style={styles.innercontainer}>
          <MaterialCommunityIcons name='flag-outline' size={65} />
          <Text style={styles.title}>
            The Kingdom Has Fallen
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 30 }}>
            Years In Power: {this.props.route.params.years ?? 0}
          </Text>
          <Animatable.Text animation='fadeInLeft' delay={1000} style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>Cards discovered: {unlockedCards}</Animatable.Text>

          <TouchableHighlight
            style={{ paddingTop: 10 }}
            onPress={() => {
              this.props.navigation.push('NewGame')
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
}

export default Defeat
