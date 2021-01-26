import Card from './Card'
import World from '../World'

class Patronage extends Card {

  constructor () {
    super()
    this.name = 'Patronage'
    this.desc = 'Throw money at your peasants to make more money!'
    this.id = 4
    this.cost = 25
    this.popcost = 1
  }

  public action(world: World) {
    world.patronage += 1
  }
}

export default Patronage
