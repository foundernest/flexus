import React from 'react'
import { createStore } from "../src/createStore";
import { useContext } from "react";
import { LocalStoreParams, Effect } from "../src/types";
import { combineReducers } from "../src/reducer";
import { create } from "react-test-renderer";

function StoreContainer({ store }: { store: React.Context<any> }) {
  const props = useContext(store) as LocalStoreParams<ExampleState, typeof exampleActions, typeof exampleEffects>

  return (
    <ChildComponent {...props} />
  )
}

function ChildComponent(props: LocalStoreParams<ExampleState, typeof exampleActions, typeof exampleEffects>) {
  return (
    <p className="sub">Sub</p>
  );
}

type ExampleState = {
  readonly count: number
}

const initialStore: ExampleState = {
  count: 0
}

// For testing purposes, why skip the types of the actions
const reducer = combineReducers<ExampleState>({
  count: (count: number = 0, action: any) => {
    switch(action.type) {
      case `/root/INCREMENT_COUNT`:
        return count + 1
      case `/root/DECREMENT_COUNT`:
        return count - 1
      case `/root/SET_COUNT`:
        return action.payload.count
      default:
        return count
    }
  }
})

const exampleActions = {
  incrementCount: jest.fn(() => ({ type: `/root/INCREMENT_COUNT` })),
  decrementCount: jest.fn(() => ({ type: `/root/DECREMENT_COUNT` })),
  setCount: jest.fn((count: number) => ({type: `/root/SET_COUNT`, payload: { count } })),
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const asyncIncrement: Effect<ExampleState, typeof exampleActions> = () => async ({ state, actions }) => {
  await sleep(1500)
  actions.incrementCount()
}

const exampleEffects = {
  asyncIncrement
}

// TODO: Test the redux dev tools

describe('createStore', () => {
  it('Check that the store is created and updates correctly', async () => {
    const { Store, Provider } = createStore<ExampleState, typeof exampleActions, typeof exampleEffects>({
      name: 'counterStore',
      initialStore,
      reducer,
      actions: exampleActions,
      effects: exampleEffects
    })
    const storeComponent = create(<Provider><StoreContainer store={Store} /></Provider>)
    
    const getStore = () => {
      return (storeComponent.root.findByType(ChildComponent).props as LocalStoreParams<ExampleState, typeof exampleActions, typeof exampleEffects>)
    }

    // State it's set correctly
    expect(getStore().state.count).toBe(initialStore.count)

    // Update the store synced
    getStore().actions.incrementCount()
    expect(getStore().state.count).toBe(initialStore.count + 1)

    // Reset the count
    getStore().actions.setCount(initialStore.count)
    expect(getStore().state.count).toBe(initialStore.count)

    // Update the store with an async effect
    await getStore().effects.asyncIncrement()
    expect(getStore().state.count).toBe(initialStore.count + 1)
  })
})