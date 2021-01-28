import Card from './Card'
import World from '../World'

class Fortify extends Card {

  constructor () {
    super()
    this.name = 'Fortify'
    this.desc = 'Add walls to the kingdom to help protect our troops when in battle'
    this.id = 2
    this.cost = 25
    this.popcost = 0
    this.icon = 'shovel'
  }

  public action(world: World) {
    world.fortifications += 10
  }
}

export default Fortify
