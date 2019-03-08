import { connect } from 'state-manager'
import { compose } from 'recompose';
import { CounterStore, CounterStoreParams } from './duck';
import { createStyles, withStyles } from '@material-ui/styles';
import React from 'react'

const CounterWithHOCs = ({ classes, count, incrementCount, decrementCount, asyncIncrement, setCount, doubleIncrement }: CounterWithHOCsProps) => {  
  return (
    <section>
      Count with HOCs and Recompose: {count}
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

type CounterWithHOCsProps = CounterStoreParams['actions'] & CounterStoreParams['effects'] & {
  classes: Record<'button' | 'buttonContainer', string>
  count: CounterStoreParams['state']['count'],
}


const styles = createStyles({
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 20,
  },

  button: {
    background: 'none',
    border: '1px solid white',
    color: 'white',
    padding: 10,
    margin: '0 10px',
    cursor: 'pointer'
  },
})

export const CounterWithHOCsAndRecompose = compose<CounterWithHOCsProps, {}>(
  withStyles(styles),
  connect<CounterStoreParams>({
    store: CounterStore,
    mapInternalProps: (store) => {
      const { count } = store.state
      const { incrementCount, decrementCount, setCount } = store.actions
      const { asyncIncrement, doubleIncrement } = store.effects
      return {
        count,
        incrementCount,
        decrementCount,
        setCount,
        asyncIncrement,
        doubleIncrement
      }
    }
  })
)(CounterWithHOCs)
