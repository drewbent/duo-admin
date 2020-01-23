import React, { useState } from 'react'
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import AuthRoute from 'components/authenticated-route'
import GlobalFlash from 'components/global-flash'
import SplashScreen from 'components/pages/splash-screen'

// Pages
import AppBar from 'components/app-bar'
import Classes from 'components/pages/classes'
import Login from 'components/pages/login'
import NotFound from 'components/pages/not-found'

import { fetchLoginStatus } from './services/auth-service'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FF7890' },
  },
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchLoginStatus: fetchLoginStatus(dispatch),
  },
})

function App(props) {
  const { actions } = props
  const [loginStatusFetched, setLoginStatusFetched] = useState(false)

  if (!loginStatusFetched) {
    actions.fetchLoginStatus().then(() => setLoginStatusFetched(true))
    return <SplashScreen />
  } else {
    return (
      <ThemeProvider theme={ theme }>
        <Router>
          <CssBaseline />
          <GlobalFlash />
          <AppBar />
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
}

export default connect(null, mapDispatchToProps)(App)
