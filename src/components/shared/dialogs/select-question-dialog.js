import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import { Dialog } from '@material-ui/core'

// import { } from 'services/'
import { flashError, flashSuccess } from 'components/global-flash'

const mapStateToProps = state => ({
  questions: state.Questions,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    
  },
})

function SelectQuestionDialog(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      
    ]).catch(flashError)
  }
  
  return (
    <Dialog
      onClose={ props.onClose }
      open={ props.open }
    >
      <Loader visible={ props.loading } />
      <MaterialTable 
        title={ props.title }    
      />
    </Dialog>
  )
}

SelectQuestionDialog.propTypes = {
  loading: PropTypes.bool,
  open: PropTypes.bool,
  title: PropTypes.string,

  /** Passes the selected question */
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectQuestionDialog)