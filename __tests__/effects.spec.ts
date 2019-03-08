import { mapEffectsToDispatch } from '../src/effects'

describe('mapEffectsToDispatch', () => {
  it('Produces an identical object constructed of a dispatcher with injected params', () => {
    const asyncIncrementThunk = jest.fn(() => 'Effect increment')
    const asyncDecrementThunk = jest.fn(() => 'Effect decrement')
    const effects = {
      asyncIncrement: () => asyncIncrementThunk,
      asyncDecrement: () => asyncDecrementThunk,
    }
    const state = {
      someState: 'hello',
    }
    const actions = {
      increment: () => ({ type: 'INCREMENT' }),
      decrement: () => ({ type: 'DECREMENT' }),
    }
    const mappedEffects = mapEffectsToDispatch(effects, state, actions)

    expect(Object.keys(mappedEffects)).toEqual(
      expect.arrayContaining(Object.keys(effects))
    )

    mappedEffects.asyncIncrement()
    expect(asyncIncrementThunk).toHaveBeenCalledWith(
      expect.objectContaining({
        state,
        actions,
        callEffect: expect.any(Function),
      })
    )
  })
  it('When effects are not available, it returns an empty object (With typesafety)', () => {
    const effects = {}
    const state = {
      someState: 'hello',
    }
    const actions = {
      increment: () => ({ type: 'INCREMENT' }),
      decrement: () => ({ type: 'DECREMENT' }),
    }
    const mappedEffects = mapEffectsToDispatch(effects, state, actions)

    expect(mappedEffects).toEqual({})
  })
})
