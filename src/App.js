import React from 'react'
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import AuthRoute from './components/authenticated-route'
import GlobalFlash from './components/global-flash'

import Classes from './components/pages/classes'
import Login from './components/pages/login'
import NotFound from './components/pages/not-found'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FF7890' },
  },
})

function App() {
  return (
    <ThemeProvider theme={ theme }>
      <Router>
        <CssBaseline />
        <GlobalFlash />
        <Switch>
          <Route component={ Login }
            exact
            path='/login' />
          <AuthRoute component={ Classes }
            exact
            path='/' />
          <Route component={ NotFound } />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
