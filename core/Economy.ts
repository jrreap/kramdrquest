import World from './World'

import { rollDice } from './utils'
import { Card } from '../types'

class Economy {
  private worldData  : World

  constructor (world: World) {
    this.worldData = world
  }

  public calculateIncome (multiplier = 0.5) {
    const income = Math.floor(multiplier * rollDice()) + this.worldData.patronage
    this.worldData.coin += income
  }

  public canPayForCard(card: Card) {
    const coinCost = card.cost
    const popCost = card.popcost

    if (this.worldData.coin - coinCost >= 0 && this.worldData.pops - popCost >= 0) {
      return true
    }

    return false
  }

  public payForCard (card : Card) {
    const coinCost = card.cost
    const popCost = card.popcost

    if (this.worldData.coin - coinCost >= 0 && this.worldData.pops - popCost >= 0) {
      this.worldData.coin -= coinCost
      this.worldData.pops -= popCost
    } else {
      console.error('Tried to pay for a card they did not have enough for!')
    }
  }

}

export default Economy
