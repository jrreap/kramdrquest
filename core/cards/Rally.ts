import Card from './Card'
import World from '../World'

class Rally extends Card {

  constructor () {
    super()
    this.name = 'Rally'
    this.desc = 'Recruit more peasants into guards'
    this.id = 0
    this.cost = 5
    this.popcost = 2
  }

  public action(world: World) {
    world.warriors += 5
  }
}

export default Rally
