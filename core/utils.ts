export function rollDice () {
  return Math.floor((Math.random() * 6) + 1)
}

export function rollCustomDice (max : number) {
  return Math.floor((Math.random() * max) + 1)
}

export function rollBattleDice () {
  return Math.floor((Math.random() * 20) + 1)
}