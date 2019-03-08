import { mapActionsToDispatch } from '../src/actions'

describe('mapActionsToDispatch', () => {
  it('Produces an identical object with functions encapsulated in the dispatch', () => {
    const actions = {
      increment: jest.fn(() => ({ type: 'INCREMENT' })),
      decrement: jest.fn(() => ({ type: 'DECREMENT' })),
    }
    const dispatch = jest.fn(callback => callback)

    const mappedActions = mapActionsToDispatch(actions, dispatch)

    expect(Object.keys(mappedActions)).toEqual(
      expect.arrayContaining(Object.keys(actions))
    )

    const calledAction = mappedActions.increment()
    expect(calledAction).toEqual(actions.increment())
    expect(dispatch).toHaveBeenCalled()
  })
})
