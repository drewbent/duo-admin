import React, { useState } from 'react'
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { green } from '@material-ui/core/colors'

import AppBar from 'components/app-bar'
import AuthRoute from 'components/authenticated-route'
import Breadcrumbs from 'components/breadcrumbs'
import GlobalFlash from 'components/global-flash'
import SplashScreen from 'components/pages/splash-screen'

// Pages
import Admin from 'components/pages/admin'
import Algorithm from 'components/pages/algorithm'
import Algorithms from 'components/pages/algorithms'
import Class from 'components/pages/class'
import Classes from 'components/pages/classes'
import CompletionFeed from 'components/pages/completion-feed'
import Distribution from 'components/pages/distribution'
import Form from 'components/pages/form'
import Forms from 'components/pages/forms'
import Login from 'components/pages/login'
import NotFound from 'components/pages/not-found'
import Session from 'components/pages/session'
import SessionFeed from 'components/pages/session-feed'
import Skill from 'components/pages/skill'
import Student from 'components/pages/student'

import { fetchLoginStatus } from './services/auth-service'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FF7890' },
    success: { main: green[600] },
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
            <Breadcrumbs />
            <GlobalFlash />
            <Switch>
              <Route component={ Login }
                exact
                path='/login' />
              <Route
                exact
                path='/'
                render={ () => <Redirect to='/admin' /> } />
              <AuthRoute component={ Admin }
                exact
                path='/admin' />
              <AuthRoute component={ Algorithm }
                exact
                path='/algorithms/:algorithmId' />
              <AuthRoute component={ Algorithms } 
                exact
                path='/algorithms' />
              <AuthRoute component={ Classes }
                exact
                path='/classes' />
              <AuthRoute component={ Skill }
                exact
                path='/classes/:classId/skills/:skill' />
              <AuthRoute component={ Student }
                exact
                path='/classes/:classId/students/:studentId' />
              <AuthRoute component={ Session }
                path='/classes/:classId/sessions/:sessionId' />
              <AuthRoute component={ Class }
                path='/classes/:classId' />
              <AuthRoute component={ Session }
                exact
                path='/session-feed/sessions/:sessionId' />
              <AuthRoute component={ Distribution }
                exact
                path='/forms/distributions/:distributionId' />
              <AuthRoute component={ Forms }
                exact
                path='/forms/distributions' />
              <AuthRoute component={ Form }
                exact
                path='/forms/:formId' />
              <AuthRoute component={ Forms }
                exact
                path='/forms' />
              <AuthRoute component={ CompletionFeed }
                path='/completion-feed' />
              <AuthRoute component={ SessionFeed }
                path='/session-feed' />
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
