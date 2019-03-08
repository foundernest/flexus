import { createStore, LocalStoreParams } from "state-manager";
import { CounterState, newStore } from "./store";
import { counterActions } from "./actions";
import { counterEffects } from "./effects";
import { reducer } from "./reducer";
import { useContext } from "react";

const { Store, Provider } = createStore<CounterState, typeof counterActions, typeof counterEffects>({
  name: 'counterStore',
  initialStore: newStore(),
  reducer,
  actions: counterActions,
  effects: counterEffects
})

export type CounterStoreParams = LocalStoreParams<CounterState, typeof counterActions, typeof counterEffects>

const useCounterStore = () => useContext(Store) as CounterStoreParams

export {
  Store as CounterStore,
  Provider as CounterProvider,
  useCounterStore
}