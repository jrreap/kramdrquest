import * as React from 'react'
import {
  View
} from 'react-native'

import { MaterialCommunityIcons} from '@expo/vector-icons'
import { GameChildProps } from '../../types'

const KingdomSeal : React.FC<GameChildProps> = ({ world }) => {
  const { seal } = world

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

  return null
}

export default KingdomSeal
