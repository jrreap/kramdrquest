import Card from './Card'
import World from '../World'

class Train extends Card {

  constructor () {
    super()
    this.name = 'Train'
    this.desc = 'Train some of our regular guards to be true soldiers!'
    this.id = 3
    this.cost = 10
    this.popcost = 0
  }

  public action(world: World) {
    world.warriorBuff += 10
  }
}

export default Train
