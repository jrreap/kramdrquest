import { rollDice } from '../../core/utils'

class World {

  i = 0
  cardindex = 1

  warriors = 10
  health = 3
  coin = 10
  pops = 25
  years = 1

  inBattle = false
  enemycount = 0
  currentWarrior = null
  currentEnemy = null
  notdead = true

  seal = { icon: 'sword', level: 0 }

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
}

export default World
