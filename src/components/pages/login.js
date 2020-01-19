import React, { useState } from 'react'

import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core'

import { login } from '../../services/auth-service'

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
          onChange={ e => setEmail(e.target.value) }
          value={ email }
        />
        <TextField 
          autoComplete='current-password'
          className={ classes.textField }
          label='Password'
          onChange={ e => setPassword(e.target.value) }
          type='password'
          value={ password }
        />
        <Button 
          className={ classes.loginButton }
          color='primary'
          onClick={ () => {
            login()
          } }
          variant='contained'
        >
          Login
        </Button>
      </Paper>
    </div>
  )
}

export default Login