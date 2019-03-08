import { useCounterStore } from './duck'
import React from 'react'

export const CounterWithHooks = ({ classes }: CounterWithHooksProps) => {
  const store = useCounterStore()
  const { count } = store.state
  const { incrementCount, decrementCount, setCount } = store.actions
  const { asyncIncrement, doubleIncrement } = store.effects

  return (
    <section>
      Count with Hooks: {count}
      <div className={classes.buttonContainer}>
        <button className={classes.button} onClick={incrementCount}>
          Increment
        </button>
        <button className={classes.button} onClick={decrementCount}>Decrement</button>
        <button className={classes.button} onClick={() => setCount(0)}>Reset</button>
        <button className={classes.button} onClick={asyncIncrement}>Async increment</button>
        <button className={classes.button} onClick={doubleIncrement}>Double increment</button>
      </div>
    </section>
  )
}

type CounterWithHooksProps = {
  classes: Record<'button' | 'buttonContainer', string>
}
