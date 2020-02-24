import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Divider, Typography, makeStyles } from '@material-ui/core'

import { fetchAllFormQuestions } from 'services/form-question-service'
import { fetchAllQuestions } from 'services/question-service'
import { flashError } from 'components/global-flash'
import { formatFullDate } from 'utils/date-utils'

const useStyles = makeStyles(theme => ({
  container: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  questionText: {
    fontWeight: 'bold',
  },
  responseText: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => ({
  formQuestions: state.FormQuestions,
  questions: state.Questions,
  student: state.Students[ownProps.feedback.studentId] || {},
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAllFormQuestions: fetchAllFormQuestions(dispatch),
    fetchAllQuestions: fetchAllQuestions(dispatch),
  },
})

function FeedbackViewer(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllQuestions(),
      actions.fetchAllFormQuestions(),
    ]).catch(flashError)
  }

  const getQuestion = response => {
    const formQuestion = props.formQuestions[response.form_question_id]
    if (formQuestion == null) return {}

    return props.questions[formQuestion.question_id] || {}
  }

  return (
    <div className={ classes.container }>
      <Typography className={ classes.questionText }>
        Student
      </Typography>
      <Typography className={ classes.responseText }>
        {props.student.name}
      </Typography>
      <Typography className={ classes.questionText }>
        Created At
      </Typography>
      <Typography className={ classes.responseText }>
        {props.feedback.createdAt}
      </Typography>
      <Divider 
        className={ classes.divider }
        orientation='horizontal' 
      />
      {(props.feedback.responses || []).map(response => {
        const question = getQuestion(response)
        return (
          <div key={ response.id }>
            <Typography className={ classes.questionText }>
              {question.question}
            </Typography>
            <Typography className={ classes.responseText }>
              {response.response}
            </Typography>
          </div>
        )
      })}
    </div>
  )
}

FeedbackViewer.propTypes = {
  /**
   * A feedback object with keys { studentId, createdAt, responses }
   */
  feedback: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackViewer)