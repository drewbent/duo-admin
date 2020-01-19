import React, { useState } from 'react'
import { Redirect, Route } from 'react-router-dom'

import { isLoggedIn } from '../services/auth-service'

function AuthenticatedRoute({ component: Component, ...rest }) {
  // TODO: Initial state should be based on some persisted state
  const [loggedIn, setLoggedIn] = useState(true)

  isLoggedIn()
    .then(loggedIn => setLoggedIn(loggedIn))

  return (
    <Route 
      { ...rest }
      render={ props => 
        loggedIn ? (
          <Component { ...props } />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  )
}

export default AuthenticatedRoute