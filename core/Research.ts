import { Card } from '../types'
import CardDeck from './CardDeck'

import shuffle from 'lodash/shuffle'

class Research {
  private worldDeck : CardDeck

  private currentResearch : Card | undefined = undefined
  private startYear : number = 0

  constructor (deck : CardDeck) {
    this.worldDeck = deck
  }

  public drawAvailableResearch () {
    let cards = this.worldDeck.getAvailableCards()
    cards = shuffle(cards)

    let selectedCards : Card[] = []

    if (cards.length < 3) {
      selectedCards = cards
      return selectedCards
    }

    // Force draw 3 unique cards
    for (let i = 0; i < 3; i++) {
      selectedCards.push(cards[i])
    }

    return selectedCards
  }

  public get isResearching () {
    return this.currentResearch !== undefined
  }

  public isResearchComplete (currentYear : number) {
    if (currentYear >= this.startYear + 50) {
      return true
    }

    return false
  }

  public selectResearch (card : Card, year : number) {
    this.currentResearch = card
    this.startYear = year
  }

  public attemptResearch () {
    if (this.currentResearch !== undefined) {
      this.worldDeck.unlockCard(this.currentResearch)
      this.currentResearch = undefined
    }
  }


} 

export default Research
