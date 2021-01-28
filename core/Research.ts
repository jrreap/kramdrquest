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

    const selectedCards : Card[] = []

    // Force draw 3 unique cards
    if (cards.length >= 3) {
      for (let i = 0; i < 3; i++){
        const index = rollCustomDice(cards.length - 1)

        const alreadySelected = selectedCards.find((card) => {
          return card.id === cards[index].id
        })

        if (!alreadySelected) {
          selectedCards.push(cards[index])
        } else {
          i--
        }
      }
    } else {
      // Only 3 or less cards remain, add them all to the selection
      for (const card of cards) {
        selectedCards.push(card)
      }
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
