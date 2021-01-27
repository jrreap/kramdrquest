import { World } from '../core'
import { Card } from '../types'
import Cards from './cards'
import Economy from './Economy'

class CardDeck {
  private worldData : World
  private worldEconomy : Economy

  private deck : Card[] = []
  private availableCards = Cards

  constructor (world: World, eco : Economy) {
    this.worldData = world
    this.worldEconomy = eco
    // Unlock starting cards
    const card = this.findAvailableCardByID(0)
    this.unlockCard(<Card>card)
  }

  public unlockCard (card : Card) {
    this.deck.push(card)

    this.availableCards = this.availableCards.filter((item) => {
      return item.id !== card.id
    })
  }

  public getDeckCard (id: number) {
    for (const card of this.deck) {
      if (card.id === id) {
        return card
      }
    }

    return null
  }

  public findAvailableCardByID (id : number) {
    for (const card of this.availableCards) {
      if (card.id === id) {
        return card
      }
    }

    return null
  }

  public getAvailableCards () {
    return this.availableCards.filter((card) => {
      return card.unlockDanger <= this.worldData.danger
    })
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
