import React from 'react'

import { makeStyles } from '@material-ui/core'

import Color from '../../constants/color'

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: Color.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
}))

function Login() {
  const classes = useStyles()

  return (
    <div className={ classes.container }>Login</div>
  )
}

export default Login