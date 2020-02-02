import React, { useState } from 'react'
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import AppBar from 'components/app-bar'
import AuthRoute from 'components/authenticated-route'
import GlobalFlash from 'components/global-flash'
import SplashScreen from 'components/pages/splash-screen'

// Pages
import Class from 'components/pages/class'
import Classes from 'components/pages/classes'
import Login from 'components/pages/login'
import NotFound from 'components/pages/not-found'
import Users from 'components/pages/users'

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
        <CssBaseline />
        <Router>
          <AppBar>
            <GlobalFlash />
            <Switch>
              <Route component={ Login }
                exact
                path='/login' />
              <Route
                exact
                path='/'
                render={ () => <Redirect to='/classes' /> } />
              <AuthRoute component={ Classes }
                exact
                path='/classes' />
              <AuthRoute component={ Class }
                exact
                path='/classes/:classId' />
              <AuthRoute component={ Users }
                exact
                path='/users' />
              <Route component={ NotFound } />
            </Switch>
            {props.children}
          </AppBar>
        </Router>
      </ThemeProvider>
    )
  }
}

export default connect(null, mapDispatchToProps)(App)
