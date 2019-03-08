import { Reducer } from './reducer'

import devToolsFactory from './helpers/devTools'

import React from 'react'

import {
  ActionHandlerMap,
  DispatchFunc,
  LocalStore,
  LocalStoreParams,
  Action,
  ValueOf,
  Effect,
  ActionMap,
  EffectsHandlersMap,
} from './types'
import { mapActionsToDispatch } from './actions'
import { mapEffectsToDispatch } from './effects'

declare var window: {
  __REDUX_DEVTOOLS_EXTENSION__: any
}

const storeInit: Action<any> = () => ({ type: 'INIT_STORE' })

export function createStore<
  State extends Object,
  AvailableActions extends ActionMap<any>,
  Effects extends { [name: string]: Effect<State, AvailableActions> } = {}
>({
  name,
  initialStore,
  actions,
  reducer,
  effects,
  activeDevTools = false,
}: {
  name?: string
  initialStore: State
  actions: AvailableActions
  reducer: Reducer<State, ValueOf<AvailableActions>>
  effects?: Effects
  activeDevTools?: boolean
}): LocalStore<
  State,
  ActionHandlerMap<AvailableActions>,
  EffectsHandlersMap<Effects>
> {
  const Store: React.Context<
    LocalStoreParams<
      State,
      ActionHandlerMap<AvailableActions>,
      EffectsHandlersMap<Effects>
    >
  > = React.createContext({} as any)

  const initialState = reducer(initialStore, storeInit())

  class ProviderClass extends React.PureComponent<{}, State> {
    displayName = name
    devTools =
      !!window.__REDUX_DEVTOOLS_EXTENSION__ && !!activeDevTools
        ? devToolsFactory({ name, initialState, setState: this.setState })
        : undefined
    state = initialState
    dispatch: DispatchFunc = (action: ValueOf<AvailableActions>) => {
      const nextState = reducer(this.state, action)
      this.setState(nextState)
      if (!!this.devTools) {
        this.devTools.addSnapshot(action, nextState)
      }
      return nextState
    }

    render() {
      const { children } = this.props

      const actionHandlers = mapActionsToDispatch(actions, this.dispatch)

      const effectHandlers = mapEffectsToDispatch<
        State,
        AvailableActions,
        Effects
      >(effects, this.state, actionHandlers)

      const contextValue = {
        state: this.state,
        effects: effectHandlers,
        actions: actionHandlers,
      }
      return <Store.Provider value={contextValue}>{children}</Store.Provider>
    }
  }

  return {
    Store,
    Provider: ProviderClass,
    Consumer: Store.Consumer,
  }
}
