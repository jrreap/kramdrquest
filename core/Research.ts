import { Card } from '../types'
import CardDeck from './CardDeck'

import { rollCustomDice } from './utils'

class Research {
  private worldDeck : CardDeck

  private currentResearch : Card | null = null

  constructor (deck : CardDeck) {
    this.worldDeck = deck
  }

  public drawAvailableResearch () {
    const cards = this.worldDeck.getAvailableCards()

    const card1 = cards[rollCustomDice(cards.length)]
    const card2 = cards[rollCustomDice(cards.length)]
    const card3 = cards[rollCustomDice(cards.length)]

    return {
      card1,
      card2,
      card3
    }
  }

  public isResearching () {
    return this.currentResearch !== null
  }

  public selectResearch (card : Card) {
    this.currentResearch = card
  }

  public attemptResearch () {
    if (this.currentResearch !== null) {
      this.worldDeck.unlockCard(this.currentResearch)
      this.currentResearch = null
    }
  }


} 

export default Research
