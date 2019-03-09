import { Action } from '../types'

declare var window: {
  __REDUX_DEVTOOLS_EXTENSION__: any
}

let id = 0

export default ({
  initialState,
  setState,
  name,
}: {
  initialState: any
  setState: (newState: any) => void
  name?: string
}) => {
  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__

  const instanceID = id
  id += 1

  const storeName = name || `Unnamed store - ${instanceID}`
  const features = {
    jump: true,
  }

  const devTools = reduxDevTools.connect({ name: storeName, features })

  devTools.subscribe((data: Action<any>) => {
    switch (data.type) {
      case 'START':
        devTools.init(initialState)
        break
      case 'RESET':
        setState(initialState)
        break
      case 'DISPATCH':
        switch (data.payload.type) {
          case 'JUMP_TO_STATE':
          case 'JUMP_TO_ACTION': {
            setState(JSON.parse(data.state))
            break
          }
          default:
            break
        }
        break
      default:
        break
    }
  })

  return {
    addSnapshot: (action: Action<any>, state: any) =>
      devTools.send(action, state, {}, instanceID),
  }
}

export type DevTools = {
  addSnapshot: (action: Action<any>, state: any) => void
}
