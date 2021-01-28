import { Card } from '../types'
import CardDeck from './CardDeck'

import shuffle from 'lodash/shuffle'

class Research {
  private worldDeck : CardDeck

  private currentResearch : Card | null = null

  constructor (deck : CardDeck) {
    this.worldDeck = deck
  }

  public drawAvailableResearch () {
    let cards = this.worldDeck.getAvailableCards()
    cards = shuffle(cards)

    const selectedCards : Card[] = []

    // Force draw 3 unique cards
    for (let i = 0; i < 3; i++) {
      selectedCards.push(cards[i])
    }

    return selectedCards
  }

  public get isResearching () {
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
