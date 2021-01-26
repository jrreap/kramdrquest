import World from "../World"

class Card {
  name: string
  desc: string
  icon: string
  id: number
  cost: number
  popcost: number

  constructor () {
    this.name = 'Card'
    this.desc = 'Card'
    this.icon = 'sword'
    this.id = -1
    this.cost = 5
    this.popcost = 5

  }

  public action(world: World) {
    console.log('Not implemented')
  }
}

export default Card