import Card from './Card'
import World from '../World'

class TrainII extends Card {

  constructor () {
    super()
    this.name = 'Train II'
    this.desc = 'Train even more of our regular guards to be true soldiers!'
    this.id = 8
    this.cost = 10
    this.popcost = 0
    this.icon = 'flag'
    this.unlockDanger = 2
  }

  public action(world: World) {
    world.warriorBuff += 20
  }
}

export default TrainII
