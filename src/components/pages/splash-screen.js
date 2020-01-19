import React from 'react'

import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function SplashScreen() {
  const classes = useStyles()

  return (
    <div className={ classes.container }>
      <CircularProgress />
    </div>  
  )
}

export default SplashScreen