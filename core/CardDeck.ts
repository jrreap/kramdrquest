import { World, consts } from '../core'
import { Card } from '../types'
import Cards from './cards'

class CardDeck {
  private worldData : World

  private deck : Card[] = []

  constructor (world: World) {
    this.worldData = world
    // Unlock starting cards
    this.unlockCard(0)
  }

  public unlockCard (id: number) {
    for (const card of Cards) {
      if (card.id === id) {
        this.deck.push(card)
      }
    }
  }

  public getDeckCard (id: number) {
    for (const card of this.deck) {
      if (card.id === id) {
        return card
      }
    }
  }

  public playCard (id: number) {

  }

  public getDeck () {
    return this.deck
  }


}

export default CardDeck
