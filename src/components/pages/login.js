import React, { useState } from 'react'
import { Redirect } from 'react-router-dom' 
import { connect } from 'react-redux'

import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core'

import { flashError } from 'components/global-flash'
import { login } from 'services/auth-service'

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

const mapStateToProps = state => ({
  isLoggedIn: state.CurrentUser.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    login: login(dispatch),
  },
})

function Login(props) {
  const classes = useStyles()
  const { actions } = props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (props.isLoggedIn) {
    return <Redirect to='/' />
  }

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
            actions.login(email, password)
              .catch(e => flashError(e.toString()))
          } }
          variant='contained'
        >
          Login
        </Button>
      </Paper>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)