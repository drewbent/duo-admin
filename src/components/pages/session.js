import React, { useState } from 'react'
import { connect } from 'react-redux'

import LineItem from 'components/shared/line-item'
import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { Paper, Toolbar, Typography, makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionAfterSession, fetchCompletionBeforeSession } from 'services/completions-service'
import { fetchFeedback } from 'services/feedback-service'
import { fetchSession } from 'services/session-service'
import { flashError } from 'components/global-flash'

import * as DateUtils from 'utils/date-utils'

const getSessionId = props => props.match.params.sessionId

const useStyles = makeStyles(theme => ({
  infoContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    maxWidth: 500,
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  content: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  feedbackQuestion: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => {
  const sessionId = getSessionId(ownProps)
  const beforeAfter = state.SessionBeforeAfter[sessionId]

  return {
    session: state.Sessions[sessionId],
    students: state.Students,
    before: beforeAfter ? state.Completions[beforeAfter.before] : undefined,
    after: beforeAfter ? state.Completions[beforeAfter.after] : undefined,
    feedback: state.SessionFeedback[sessionId],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sessionId = getSessionId(ownProps)

  return {
    actions: {
      fetchSession: () => fetchSession(dispatch)(sessionId),
      fetchFeedback: () => fetchFeedback(dispatch)(sessionId),
      fetchCompletionBefore: () => fetchCompletionBeforeSession(dispatch)(sessionId),
      fetchCompletionAfter: () => fetchCompletionAfterSession(dispatch)(sessionId),
      fetchStudents: fetchAllStudents(dispatch),
    },
  }
}

function SingleCompletionTable(props) {
  return (
    <MaterialTable 
      columns={ [
        {
          title: 'ID',
          field: 'id',
        },
        {
          title: '# Correct',
          field: 'questions_correct',
        },
        {
          title: '# Questions',
          field: 'questions_out_of',
        },
        {
          title: 'Mastery Category',
          field: 'mastery_category',
        },
        {
          title: 'Recorded From',
          field: 'recorded_from',
        },
        {
          title: 'Recorded At',
          render: rowData => DateUtils.formatDateTime(rowData.created_at),
        },
      ] }
      data={ props.completion ? [props.completion] : [] }
      options={ { 
        search: false,
        paging: false,
      } }
      { ...props.tableProps }
    />
  )
}

function FeedbackQuestions({ questions, classes }) {
  return (
    <div>
      {Object.keys(questions).map(question => (
        <div className={ classes.feedbackQuestion }>
          <Typography className={ classes.questionText }>{question}</Typography>
          <Typography>{questions[question]}</Typography>
        </div>
      ))}
    </div>
  )
}

function Session(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchSession(),
      actions.fetchFeedback(),
      actions.fetchCompletionBefore(),
      actions.fetchCompletionAfter(),
      actions.fetchStudents(),
    ]).catch(flashError)
  }

  const getGuide = () => (
    props.students[props.session.guide_id] || {}
  )
  
  const getLearner = () => (
    props.students[props.session.learner_id] || {}
  )

  return (
    <Page>
      {props.session 
        ?
        <div>
          <Paper className={ classes.section }>
            <Toolbar>
              <Typography variant='h5'>
                Session Info
              </Typography>
            </Toolbar>
            <div className={ classes.infoContainer }>
              <LineItem 
                detail={ props.session.id }
                title='ID' 
              />
              <LineItem 
                detail={ props.session.skill }
                title='Skill'
              />
              <LineItem 
                detail={ getGuide().name }
                title='Guide' 
              />
              <LineItem 
                detail={ getLearner().name } 
                title='Learner' 
              />
              <LineItem
                detail={ DateUtils.formatDate(props.session.start_time) } 
                title='Date' 
              />
              <LineItem 
                detail={ DateUtils.formatTime(props.session.end_time) } 
                title='Start Time' 
              />
              <LineItem
                detail={
                  DateUtils.areSameDate(props.session.start_time, props.session.end_time)
                    ? DateUtils.formatTime(props.session.end_time)
                    : DateUtils.formatDateTime(props.session.end_time)
                } 
                title='End Time' 
              />
              <LineItem 
                detail={ props.session.cancellation_reason || 'N/A' }
                title='Cancellation Reason'
              />
            </div>
          </Paper>
          <div className={ classes.section }>
            <SingleCompletionTable 
              completion={ props.before }
              tableProps={ {
                title: 'Before',
              } }
            />
          </div>
          <div className={ classes.section }>
            <SingleCompletionTable 
              completion={ props.after }
              tableProps={ {
                className: classes.section,
                title: 'After',
              } }
            />
          </div>
          <Paper className={ classes.section }>
            <Toolbar>
              <Typography variant='h6'>
                Session Feedback
              </Typography>
            </Toolbar>
            <div className={ classes.content }>
              {
                props.feedback ?
                  (Object.keys(props.feedback).length === 0 ?
                    <Typography>No feedback for this session.</Typography>
                    :
                    <FeedbackQuestions 
                      classes={ classes }
                      questions={ props.feedback.questions } 
                    />)
                  :
                  null
              }
            </div>
          </Paper>
        </div>
        :
        <Loader visible />}
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Session)