import React from 'react'
import { connect } from 'react-redux'

import { logout } from '../../services/auth-service'

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: logout(dispatch),
  },
})

function Classes(props) {
  const { actions } = props

  return (
    <div>
      Classes appear here
      <button onClick={ () => {
        actions.logout()
      } }>
        Log Out
      </button>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(Classes)