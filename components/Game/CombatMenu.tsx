import * as React from 'react'
import {
  Text,
  View
} from 'react-native'

import { MaterialCommunityIcons} from '@expo/vector-icons'
import { consts } from '../../core'
import { GameChildProps } from '../../types'

const CombatMenu : React.FC<GameChildProps> = ({ world }) => {
  const { inBattle, fortifications, enemyCount, currentEnemy, currentWarrior} = world
  const styles = consts.styles

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

export default CombatMenu
