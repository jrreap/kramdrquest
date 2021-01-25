import World from './World'

import { rollDice, rollBattleDice } from './utils'
import { DEAD, WARRIORCLASSES, ENEMYCLASSES} from './consts'


class Combat {
  private worldData : World

  constructor (world: World) {
    this.worldData = world
  }

  public conductBattle () {
    const world = this.worldData

    if (world.currentEnemy === DEAD && world.enemyCount > 0) {
      if (world.combatLevel < ENEMYCLASSES.length) {
        world.currentEnemy = ENEMYCLASSES[world.combatLevel]
      } else {
        world.currentEnemy = ENEMYCLASSES[1]
      }
    } else if (world.enemyCount <= 0) {
      world.inBattle = false
      world.calculateIncome(2) // Loot
      world.enemyCount = 0
      return true
    }

    if (world.currentWarrior === DEAD && world.warriors > 0) {
      if (world.warriorBuff > 0) {
        world.currentWarrior = WARRIORCLASSES[1]
        world.warriorBuff -= 1
      } else {
        world.currentWarrior = WARRIORCLASSES[0]
      }
    } else if (world.warriors <= 0) {
      world.inBattle = false
      world.enemyCount = 0
      world.health--

      return world.isAlive
    }

    if (world.currentWarrior.damage * rollDice() < world.currentEnemy.damage * rollDice()) {
      if (world.fortifications > 0) {
        world.fortifications -= 1
      } else {
        world.currentWarrior = DEAD
        world.warriors -= 1
      }
    } else {
      world.currentEnemy = DEAD
      world.enemyCount -= 1
    }

    return true
  }

  public conductPeace  () {
    const world = this.worldData
    const dice = rollDice()

    if (rollBattleDice() >= 19) {
      world.inBattle = true
      world.enemyCount += (rollDice() * dice) * world.danger

      if (world.combatLevel < ENEMYCLASSES.length) {
        world.currentEnemy = ENEMYCLASSES[world.combatLevel]
      } else {
        world.currentEnemy = ENEMYCLASSES[1]
      }

      if (world.warriorBuff > 0) {
        world.currentWarrior = WARRIORCLASSES[1]
      } else {
        world.currentWarrior = WARRIORCLASSES[0]
      }
    } else {
      world.calculateIncome()
      world.pops += Math.floor(0.4 * dice)
    }
  }


}

export default Combat
