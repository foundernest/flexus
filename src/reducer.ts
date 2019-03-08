// This is extracted directly from Redux

import { Action } from './types'

function getUndefinedStateErrorMessage(key: string, action: Action<any>) {
  const actionType = action && action.type
  const actionDescription =
    (actionType && `action "${String(actionType)}"`) || 'an action'

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
}

function assertReducerShape(reducers: ReducersMapObject) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: '' })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`
      )
    }
  })
}

export type Reducer<S, A = Action<any>> = (state: S, action: A) => S

export type ReducersMapObject<S = any, A = Action<any>> = {
  [K in keyof S]: Reducer<S[K], A>
}

export function combineReducers<S, A = Action<any>>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {} as ReducersMapObject
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i] as keyof S

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  let shapeAssertionError: Error
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(receivedState: S | undefined, action: Action<any>) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    let hasChanged = false
    const state = receivedState || {} as any
    const nextState: S = Object.assign({}, state)
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i] as keyof S
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(
          key as string,
          action
        )
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : (state as S)
  }
}
