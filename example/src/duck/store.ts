export type CounterState = {
  readonly count: number
}

export function newStore(): CounterState {
  return {
    count: 0
  }
}