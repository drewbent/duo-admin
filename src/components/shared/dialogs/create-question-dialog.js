import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import { TextField } from '@material-ui/core'

import { fetchQuestionTypes } from 'services/question-service'
import { flashError } from 'components/global-flash'

const mapStateToProps = state => ({
  questionTypes: state.QuestionTypes,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchQuestionTypes: fetchQuestionTypes(dispatch),
  },
})

function CreateQuestionDialog(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    actions.fetchQuestionTypes().catch(flashError)
  }

  console.log(props.questionTypes)

  return (
    <ConfirmDialog
      loading={ props.loading }
      open
    >
      <TextField />
      <TextField />
    </ConfirmDialog>
  )
}

CreateQuestionDialog.propTypes = {
  loading: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionDialog)