import React, { useState } from 'react'
import { connect } from 'react-redux'

import Page from 'components/shared/page'

// import { } from 'services/'
import { flashError, flashSuccess } from 'components/global-flash'

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  actions: {
    
  },
})

function Distribution(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      
    ]).catch(flashError)
  }
  
  return (
    <Page>
      Hello
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Distribution)