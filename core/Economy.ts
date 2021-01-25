import World from './World'

import { rollDice } from './utils'

class Economy {

  worldData  : World

  constructor (world: World) {
    this.worldData = world
  }

  public calculateIncome (multiplier = 0.5) {
    const income = Math.floor(multiplier * rollDice()) + this.worldData.patronage
    this.worldData.coin += income
  }

}

export default Economy
