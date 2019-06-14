import { combineReducers } from '../src/reducer'

describe('combineReducers', () => {
  it('returns a composite reducer that maps the state keys to given reducers', () => {
    type State = {
      counter?: number
      stack?: any
    }
    const reducer = combineReducers<State>({
      counter: (state = 0, action) =>
        action.type === 'increment' ? state + 1 : state,
      stack: (state = [], action) =>
        action.type === 'push' ? [...state, action.value] : state,
    })

    const s1 = reducer({}, { type: 'increment' })
    expect(s1).toEqual({ counter: 1, stack: [] })
    const s2 = reducer(s1, { type: 'push', value: 'a' })
    expect(s2).toEqual({ counter: 1, stack: ['a'] })
  })

  it('throws an error if a reducer returns undefined handling an action', () => {
    type State = {
      counter?: number
    }
    const reducer = combineReducers<State>({
      counter(state: number = 0, action: any) {
        switch (action && action.type) {
          case 'increment':
            return state + 1
          case 'decrement':
            return state - 1
          case 'whatever':
          case null:
          case undefined:
            return undefined
          default:
            return state
        }
      },
    })

    expect(() => reducer({ counter: 0 }, { type: 'whatever' })).toThrow(
      /"whatever".*"counter"/
    )
    expect(() => reducer({ counter: 0 }, null)).toThrow(/"counter".*an action/)
    expect(() => reducer({ counter: 0 }, {})).toThrow(/"counter".*an action/)
  })

  it('throws an error on first call if a reducer returns undefined initializing', () => {
    type State = {
      counter?: number
    }
    const reducer = combineReducers<State>({
      counter(state: number, action: any) {
        switch (action.type) {
          case 'increment':
            return state! + 1
          case 'decrement':
            return state! - 1
          default:
            return state
        }
      },
    })
    expect(() => reducer({}, undefined)).toThrow(/"counter".*initialization/)
  })

  it('maintains referential equality if the reducers it is combining do', () => {
    type State =
      | undefined
      | {
          child1?: {}
          child2?: {}
          child3?: {}
        }
    const reducer = combineReducers<State>({
      child1(state: {} = {}) {
        return state
      },
      child2(state: {} = {}) {
        return state
      },
      child3(state: {} = {}) {
        return state
      },
    })

    const initialState = reducer(undefined, '@@INIT')
    expect(reducer(initialState, { type: 'FOO' })).toBe(initialState)
  })

  it('does not have referential equality if one of the reducers changes something', () => {
    type State =
      | undefined
      | {
          child1?: {}
          child2?: {
            count: number
          }
          child3?: {}
        }
    const reducer = combineReducers<State>({
      child1(state: {} = {}) {
        return state
      },
      child2(state: { count: number } = { count: 0 }, action: any) {
        switch (action.type) {
          case 'increment':
            return { count: state.count + 1 }
          default:
            return state
        }
      },
      child3(state: {} = {}) {
        return state
      },
    })

    const initialState = reducer(undefined, '@@INIT')
    expect(reducer(initialState, { type: 'increment' })).not.toBe(initialState)
  })
})
