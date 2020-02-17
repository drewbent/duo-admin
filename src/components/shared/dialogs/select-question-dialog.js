import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import { Dialog } from '@material-ui/core'

import { fetchAllQuestions } from 'services/question-service'
import { flashError } from 'components/global-flash'
import { getOptionsDesc } from 'utils/question-utils'

const mapStateToProps = state => ({
  questions: state.Questions,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAllQuestions: fetchAllQuestions(dispatch),
  },
})

function SelectQuestionDialog(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllQuestions(),
    ]).catch(flashError)
  }
  
  return (
    <Dialog
      onClose={ props.onClose }
      open={ props.open }
    >
      <Loader visible={ props.loading } />
      <MaterialTable 
        columns={ [
          { title: 'ID', field: 'id' },
          { title: 'Question', field: 'question' },
          { title: 'Options', render: getOptionsDesc },
        ] }
        data={ Object.values(props.questions) }  
        onRowClick={ (_, rowData) => {
          if ((props.blacklist || []).includes(rowData.id))
            flashError('Question already in form')
          else
            props.onSelect(rowData)
        } }
        title={ props.title }
      />
    </Dialog>
  )
}

SelectQuestionDialog.propTypes = {
  loading: PropTypes.bool,
  open: PropTypes.bool,
  title: PropTypes.string,

  /** Question IDs to disable */
  blacklist: PropTypes.arrayOf(PropTypes.number),

  /** Passes the selected question */
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectQuestionDialog)