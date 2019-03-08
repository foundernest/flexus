import React, { FunctionComponent } from 'react'

// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ArgumentTypes<F extends Action<any>> = F extends (...args: infer A) => any ? A : never;
export type ValueOf<T> = T[keyof T];
export type MergeProps<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type Required<T> = { [P in keyof T]-?: T[P] };

export type Action<ActionCreatorOrMap> = ActionCreatorOrMap extends ActionCreator<string> ? ReturnType<ActionCreatorOrMap> : ActionCreatorOrMap extends object ? ActionMap<ActionCreatorOrMap>[keyof ActionCreatorOrMap] : never;
export declare type ActionCreator<T extends string> = (...args: any[]) => {
  type: T;
};
export declare type ActionMap<T> = {
  [K in keyof T]: Action<T[K]>;
};
export type ActionHandlerMap<T> = { [name in keyof T]: (...args: any) => any }
export type DispatchFunc = (action: Action<any>) => any;

export type LocalStoreParams<State extends Object, AvailableActionType, EffectsHandler> = {
  state: State
  actions: ActionHandlerMap<AvailableActionType>
  effects: EffectsHandler
}
export type LocalStore<State extends Object, AvailableActionType, EffectsHandler> = {
  Store: React.Context<LocalStoreParams<State, AvailableActionType, EffectsHandler>>,
  Consumer: FunctionComponent<{}>,
  Provider: React.ComponentType<{}>,
}

export type Effect<State extends Object, AvailableActions> = (...args: any) => EffectDispatch<State, AvailableActions>
export type EffectDispatch<State extends Object, AvailableActions> = (params: EffectDispatchParams<State, AvailableActions>) => void
export type EffectDispatchParams<State extends Object, AvailableActions> = {
  state: State,
  actions: ActionHandlerMap<AvailableActions>;
  callEffect: (callback: EffectDispatch<State, AvailableActions>) => void
}
export type EffectsHandlersMap<T> = { [name in keyof T]: (...args: any) => any }