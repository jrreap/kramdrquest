import { World } from '../core'
import { Card } from '../types'
import Cards from './cards'
import Economy from './Economy'

class CardDeck {
  private worldData : World
  private worldEconomy : Economy

  private deck : Card[] = []

  constructor (world: World, eco : Economy) {
    this.worldData = world
    this.worldEconomy = eco
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

    return null
  }

  public playCard (card : Card) {
    if (this.worldEconomy.canPayForCard(card)) {
      this.worldEconomy.payForCard(card)
      card.action(this.worldData)
      return true
    }

    return false
  }

  public getDeck () {
    return this.deck
  }


}

export default CardDeck
