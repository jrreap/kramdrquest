import { rollDice } from './utils'

import { KingdomSeal, Unit } from '../types'
import { DEAD } from './consts'


class World {

  i = 0
  cardIndex = 1

  warriors = 10
  private _health = 3
  coin = 10
  pops = 25
  years = 1

  inBattle = false
  enemyCount = 0
  currentWarrior : Unit = DEAD
  currentEnemy : Unit = DEAD
  combatLevel = 0
  danger = 1

  seal : KingdomSeal = { icon: 'sword', level: 0 }

  fortifications = 0
  warriorBuff = 0
  patronage = 0
  researchSpeed = 1.0

  constructor() {
    this.generateWorld()
  }

  generateWorld () {
    // Create the kingdom seal
    switch (rollDice()) {
      case (1): {
        this.seal.icon = 'sword'
        break
      }
      case (2): {
        this.seal.icon = 'cupcake'
        break
      }
      case (3): {
        this.seal.icon = 'ship-wheel'
        break
      }
      case (4): {
        this.seal.icon = 'ubuntu'
        break
      }
      case (5): {
        this.seal.icon = 'cat'
        break
      }
      case (6): {
        this.seal.icon = 'castle'
        break
      }
    }

    // Now to vary the world a bit for different play styles
    this.coin += rollDice() * rollDice()
    this.warriors += Math.floor(rollDice() * 1.5)
    this.pops += Math.floor(rollDice() * 0.8)
  }

  public get health () {
    return this._health
  }

  public set health (amount: number){
    if (amount >= 0) {
      this._health = amount
    }
  }

  public get isAlive () {
    return this.health > 0
  }

  public increaseDifficultyLevel () {
    this.combatLevel++
    this.danger++
  }
}

export default World
