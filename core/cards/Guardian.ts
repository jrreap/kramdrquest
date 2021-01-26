import Card from './Card'
import World from '../World'

class Guardian extends Card {

  constructor () {
    super()
    this.name = 'Guardian'
    this.desc = 'Recruit more peasants into guards'
    this.id = 0
    this.cost = 5
    this.popcost = 2
  }

  public action(world: World) {
    world.warriors += 5
  }
}

export default Guardian
