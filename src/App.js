import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Login from './components/pages/login'

function App() {
  return (
    <Router>
      <CssBaseline />
      <Switch>
        <Route component={ Login }
          exact
          path='/login' />
      </Switch>
    </Router>
  )
}

export default App
