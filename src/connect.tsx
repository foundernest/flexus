import React, { ComponentType } from 'react'
import { MergeProps } from './types'

type ConnectParams<StoreParams, InternalProps, ExternalProps> = {
  name?: string
  store: React.Context<StoreParams>
  shouldComponentUpdate?: (
    prevProps: Readonly<ExternalProps>,
    nextProps: Readonly<ExternalProps>
  ) => boolean
  mapInternalProps?: (store: StoreParams, props: ExternalProps) => InternalProps
}

export function connect<StoreParams, InternalProps = any, ExternalProps = {}>({
  name,
  mapInternalProps,
  store,
  shouldComponentUpdate,
}: ConnectParams<StoreParams, InternalProps, ExternalProps>) {
  const HOC = (
    WrappedComponent: ComponentType<
      MergeProps<InternalProps, ExternalProps> | MergeProps<ExternalProps, { store: StoreParams }>
    >
  ) => {
    const ConnectedComponent = (props: ExternalProps) => {
      return (
        <store.Consumer>
          {(storeParams: StoreParams) => {
            const injectedProps = mapInternalProps
              ? { ...props ,...mapInternalProps(storeParams, props) }
              : ({ ...props, store: storeParams } as MergeProps<
                  ExternalProps,
                  { store: StoreParams }
                >)
            return <WrappedComponent {...injectedProps} />
          }}
        </store.Consumer>
      )
    }
    if (name) {
      ConnectedComponent.displayName = name
    }
    return React.memo(ConnectedComponent, shouldComponentUpdate)
  }
  return HOC
}
