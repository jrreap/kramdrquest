import Card from './Card'
import World from '../World'

class MooMula extends Card {

  constructor () {
    super()
    this.name = 'Moo Mula'
    this.desc = 'Converting peasants to money... what could go wrong!'
    this.id = 1
    this.cost = 0
    this.popcost = 10
    this.icon = 'cow'
  }

  public action(world: World) {
    world.coin += 20
  }
}

export default MooMula
