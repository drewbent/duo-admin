import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isLoggedIn: state.CurrentUser.isLoggedIn,
})

function AuthenticatedRoute({ isLoggedIn, component: Component, ...rest }) {
  return (
    <Route 
      { ...rest }
      render={ props => 
        isLoggedIn ? (
          <Component { ...props } />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  )
}

export default connect(mapStateToProps)(AuthenticatedRoute)