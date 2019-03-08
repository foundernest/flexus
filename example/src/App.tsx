import React from 'react'
import logo from './logo.svg'
import { makeStyles } from '@material-ui/styles'
import { CounterWithHooks } from './CounterWithHooks'
import { CounterWithHOCsAndRecompose } from './CounterWithHOCAndRecompose';

const App = ({}) => {
    const classes = useStyles()
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <header>
            <img src={logo} className={classes.logo} alt="logo" />
            <p>State manager test</p>
          </header>
          <CounterWithHooks classes={classes} />
          <hr className={classes.separator} />
          <CounterWithHOCsAndRecompose />
        </div>
      </div>
    )
  }

export default React.memo(App)

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
  logo: {
    animation: '$logo-spin infinite 20s linear',
    height: '40vmin',
  },
  content: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },

  separator: {
    marginTop: '35px',
    marginBottom: '25px',
    width: '300px'
  },

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

  '@keyframes logo-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
})
