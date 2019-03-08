import { ArgumentTypes, EffectDispatch, ActionHandlerMap, EffectsHandlersMap } from "./types";

export function mapEffectsToDispatch<State, Actions, Effects>(
  effects: Effects | undefined,
  state: State,
  actions: ActionHandlerMap<Actions>
): EffectsHandlersMap<Effects> {
  if(!effects) {
    return {} as EffectsHandlersMap<Effects>
  }
  let handlers = {}
  const callEffect = (callback: EffectDispatch<State, Actions>) => callback({ state, actions, callEffect })

  Object.keys(effects).map(effectKey => {
    const effect = effects[effectKey]
    handlers[effectKey] = (...args: ArgumentTypes<typeof effect>) =>
      callEffect(effect(...args))
  })

  return handlers as EffectsHandlersMap<Effects>
}
