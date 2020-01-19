import React from 'react'

import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    minWidth: '400px',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  loginButton: {
    color: 'white',
    marginTop: theme.spacing(2),
  },
}))

function Login() {
  const classes = useStyles()

  return (
    <div className={ classes.container }>
      <Paper className={ classes.contentContainer }>
        <Typography 
          className={ classes.title }
          variant='h3'
        >
          Welcome!
        </Typography>
        <TextField
          className={ classes.textField }
          label='Email'
        />
        <TextField 
          autoComplete='current-password'
          className={ classes.textField }
          label='Password'
          type='password'
        />
        <Button 
          className={ classes.loginButton }
          color='primary'
          variant='contained'
        >
          Login
        </Button>
      </Paper>
    </div>
  )
}

export default Login