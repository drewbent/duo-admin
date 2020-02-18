/**
 * @fileoverview Previews a "form"
 */
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import FeedbackQuestion from 'components/shared/feedback-question'
import { makeStyles } from '@material-ui/core'

import { fetchAllQuestions } from 'services/question-service'
import { fetchFormQuestionsForForm } from 'services/form-question-service'
import { flashError } from 'components/global-flash'
import { getFormQuestionsForForm } from 'redux/reducers/form-questions'

const useStyles = makeStyles(theme => ({
  question: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => ({
  allQuestions: state.Questions,
  formQuestions: getFormQuestionsForForm(state, ownProps.formId)
    .sort((a, b) => a.index_in_form < b.index_in_form),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: {
    fetchFormQuestions: () => fetchFormQuestionsForForm(dispatch)(ownProps.formId),
    fetchAllQuestions: fetchAllQuestions(dispatch),
  },
})

function FeedbackForm(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllQuestions(),
    ]).catch(flashError)
  }

  useEffect(() => {
    if (props.formId) actions.fetchFormQuestions()
  }, [props.formId])

  if (props.formId == null)
    return null

  return (
    <div className={ classes.container }>
      {(props.formQuestions || []).map(formQuestion => (
        <FeedbackQuestion 
          data={ {
            formQuestion,
            question: props.allQuestions[formQuestion.question_id],
          } }
          key={ formQuestion.id }
          onChange={ value => {
            props.onChange({
              ...props.value,
              [formQuestion.id]: value,
            })
          } }
          value={ props.value[formQuestion.id] }
        />
      ))}
    </div>
  )
}

FeedbackForm.propTypes = {
  formId: PropTypes.number,
  /**
   * Takes a mapping of formQuestionId => response
   */
  value: PropTypes.object,
  /**
   * Passes a mapping of formQuestionId => response
   */
  onChange: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackForm)