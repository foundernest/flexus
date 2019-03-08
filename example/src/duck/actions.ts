import { createAction } from 'typesafe-actions'

export const counterActions = {
  incrementCount: createAction(
    `/root/INCREMENT_COUNT`
  ),
  
  decrementCount: createAction(
    `/root/DECREMENT_COUNT`,
  ),
  
  setCount: createAction(
    '/root/SET_COUNT',
    resolve => (count: number) => resolve({ count })
  )
}