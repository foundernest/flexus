import { combineReducers } from "state-manager";
import { CounterState } from "./store";
import { counterActions } from "./actions";
import { ActionType, getType } from 'typesafe-actions'


export const reducer = combineReducers<CounterState>({
  count: (count: number = 0, action: ActionType<typeof counterActions>) => {
    switch(action.type) {
      case getType(counterActions.incrementCount):
        return count + 1
      case getType(counterActions.decrementCount):
        return count - 1
      case getType(counterActions.setCount):
        return action.payload.count
      default:
        return count
    }
  }
}) 