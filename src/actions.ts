import {
  DispatchFunc,
  ActionMap,
  ArgumentTypes,
  ActionHandlerMap,
} from './types'

export function mapActionsToDispatch<Actions>(
  actions: Actions,
  dispatch: DispatchFunc
): ActionHandlerMap<Actions> {
  let handlers = {}
  Object.keys(actions).map(actionKey => {
    const action = actions[actionKey]
    handlers[actionKey] = (...args: ArgumentTypes<typeof action>) =>
      dispatch(action(...args))
  })
  return handlers as ActionHandlerMap<Actions>
}
