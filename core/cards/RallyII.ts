import Card from './Card'
import World from '../World'

class RallyII extends Card {

  constructor () {
    super()
    this.name = 'Rally II'
    this.desc = 'Recruit more peasants into guards'
    this.id = 7
    this.cost = 7
    this.popcost = 3
    this.unlockDanger = 2
  }

  public action(world: World) {
    world.warriors += 15
  }
}

export default RallyII
