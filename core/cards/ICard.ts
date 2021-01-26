interface ICard {
  name: string
  desc: string
  icon: string
  unlocked: boolean
  id: number
  cost: number
  popcost: number

  action : Function
}