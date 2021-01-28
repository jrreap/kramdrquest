import Card from './Card'
import World from '../World'

import { rollDice } from '../utils'

class ArrowStorm extends Card {

  constructor () {
    super()
    this.name = 'Arrow Storm'
    this.desc = 'Have our archers rail death from above with a volley of arrows!'
    this.id = 5
    this.cost = 10
    this.popcost = 0
    this.icon = 'bullseye-arrow'
  }

  public action(world: World) {
    world.enemyCount -= 2 * rollDice()
  }
}

export default ArrowStorm
