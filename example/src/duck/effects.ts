import { CounterState } from "./store";
import { counterActions } from "./actions";
import { Effect } from "state-manager";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const asyncIncrement: Effect<CounterState, typeof counterActions> = () => async ({ state, actions, callEffect }) => {
  await sleep(1500)
  actions.incrementCount()
}

const doubleIncrement: Effect<CounterState, typeof counterActions> = () => ({ state, actions }) => {
  actions.setCount(state.count + 2)
}

export const counterEffects = ({
  asyncIncrement,
  doubleIncrement,
})