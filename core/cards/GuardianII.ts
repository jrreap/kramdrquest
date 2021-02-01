import Card from './Card'
import World from '../World'

class GuardianII extends Card {

  constructor () {
    super()
    this.name = 'Guardian II'
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

export default GuardianII
