/**
 * @fileoverview Dialog that provides a form to enter student responses, given 
 * a session
 */
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import DistributionSelector from 'components/shared/selectors/distribution-selector'
import FeedbackForm from 'components/shared/feedback-form'
import { FormControl, InputLabel, MenuItem, Select, makeStyles } from '@material-ui/core'

import { fetchAllQuestions } from 'services/question-service'
import { fetchFormQuestionsForForm } from 'services/form-question-service'
import { flashError } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => ({
  learner: state.Students[ownProps.session.learner_id] || {},
  guide: state.Students[ownProps.session.guide_id] || {},
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchFormQuestionsForForm: fetchFormQuestionsForForm(dispatch),
    fetchAllQuestions: fetchAllQuestions(dispatch),
  },
})

function CreateResponseDialog(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [studentId, setStudentId] = useState(-1)
  const [distribution, setDistribution] = useState({})
  const [feedbackResponses, setFeedbackResponses] = useState({})
  
  useEffect(() => {
    setFeedbackResponses({})
  }, [distribution])

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllQuestions(),
    ]).catch(flashError)
  }
  
  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      onConfirm={ () => {
        if (studentId === -1)
          return flashError('Must select a student')

        if (distribution.id == null)
          return flashError('Must select a distribution')
        
        props.onConfirm({
          session_id: props.session.id,
          student_id: studentId,
          distribution_id: distribution.id,
          responses: feedbackResponses,
        })
      } }
      open={ props.open }
      title='Create Response'
    >
      <FormControl 
        className={ classes.section }
        fullWidth
      >
        <InputLabel id='create-response-dialog-label'>Student</InputLabel>
        <Select
          aria-labelledby='create-response-dialog-label'
          onChange={ e => setStudentId(e.target.value) }
          value={ studentId }
        >
          <MenuItem value={ -1 }><em>None</em></MenuItem>
          <MenuItem value={ props.learner.id }>
            {props.learner.name}
          </MenuItem>
          <MenuItem value={ props.guide.id }>
            {props.guide.name}
          </MenuItem>
        </Select>
      </FormControl>
      <DistributionSelector 
        className={ classes.section }
        onChange={ distribution => {
          setDistribution(distribution || {})
        } }
        value={ distribution.id || -1 }
      />
      <FeedbackForm 
        formId={ distribution.form_id }
        onChange={ setFeedbackResponses }
        value={ feedbackResponses }
      />
    </ConfirmDialog>
  )
}

CreateResponseDialog.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func,

  /**
   * Passes an object formatted:
   * {
   *  student_id,
   *  session_id,
   *  distribution_id,
   *  responses: { form_question_id: response }
   * }
   */
  onConfirm: PropTypes.func,
  session: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateResponseDialog)