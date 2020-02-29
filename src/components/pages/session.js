import React, { useState } from 'react'
import { connect } from 'react-redux'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import CreateFeedbackDialog from 'components/shared/dialogs/create-feedback-dialog'

import FeedbackWidget from 'components/shared/widgets/feedback-widget'
import InfoWidget from 'components/shared/widgets/info-widget'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { FormControl, InputLabel, MenuItem, Paper, Select, makeStyles, useTheme } from '@material-ui/core'

import { cancelSession, fetchCancellationReasons, fetchSession, finishSession } from 'services/session-service'
import { createFeedback, fetchResponsesForSession } from 'services/response-service'
import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionAfterSession, fetchCompletionBeforeSession } from 'services/completions-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getFeedbackForSession } from 'redux/reducers/responses'

import * as DateUtils from 'utils/date-utils'

const getSessionId = props => parseInt(props.match.params.sessionId, 10)

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
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  responseQuestion: {
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
    feedback: getFeedbackForSession(state, sessionId),
    cancellationReasons: state.CancellationReasons,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sessionId = getSessionId(ownProps)

  return {
    actions: {
      createFeedback: createFeedback(dispatch),
      fetchSession: () => fetchSession(dispatch)(sessionId),
      fetchResponses: () => fetchResponsesForSession(dispatch)(sessionId),
      fetchCompletionBefore: () => fetchCompletionBeforeSession(dispatch)(sessionId),
      fetchCompletionAfter: () => fetchCompletionAfterSession(dispatch)(sessionId),
      fetchStudents: fetchAllStudents(dispatch),
      fetchCancellationReasons: fetchCancellationReasons(dispatch),
      cancelSession: cancelSession(dispatch),
      finishSession: finishSession(dispatch),
    },
  }
}

function SingleCompletionTable(props) {
  return (
    <MaterialTable 
      columns={ [
        { title: 'ID', field: 'id' },
        { title: '# Correct', field: 'questions_correct' },
        { title: '# Questions', field: 'questions_out_of' },
        { title: 'Mastery Category', field: 'mastery_category' },
        { title: 'Recorded From', field: 'recorded_from' },
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

function Session(props) {
  const theme = useTheme()
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [createFeedbackDialogOpen, setCreateFeedbackDialogOpen] = useState(false)
  const [createFeedbackDialogLoading, setCreateFeedbackDialogLoading] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelDialogLoading, setCancelDialogLoading] = useState(false)
  const [cancellationReason, setCancellationReason] = useState(-1)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchSession(),
      actions.fetchResponses(),
      actions.fetchCompletionBefore(),
      actions.fetchCompletionAfter(),
      actions.fetchStudents(),
      actions.fetchCancellationReasons(),
    ]).catch(flashError)
  }

  const session = props.session || {}

  const getGuide = () => (
    props.students[session.guide_id] || {}
  )
  
  const getLearner = () => (
    props.students[session.learner_id] || {}
  )
  
  return (
    <Page loading={ props.session == null }>
      <ConfirmDialog
        loading={ cancelDialogLoading }
        onClose={ () => setCancelDialogOpen(false) }
        onConfirm={ () => {
          if (cancellationReason === -1)
            return flashError('Must select a reason')
          
          const data = { cancellation_reason: cancellationReason }
          setCancelDialogLoading(true)
          actions.cancelSession(session.id, data)
            .then(() => {
              setCancelDialogLoading(false)
              setCancelDialogOpen(false)
              flashSuccess('Session cancelled')
            })
            .catch(err => {
              setCancelDialogLoading(false)
              flashError(err)
            })
        } }
        open={ cancelDialogOpen }
        title='Cancel Session'
      >
        <FormControl fullWidth>
          <InputLabel id='reason-selector-label'>Reason</InputLabel>
          <Select
            onChange={ e => setCancellationReason(e.target.value) }
            value={ cancellationReason }
          >
            <MenuItem value={ -1 }><em>None</em></MenuItem>
            {(props.cancellationReasons || []).map(reason => (
              <MenuItem value={ reason.value }>{ reason.title }</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ConfirmDialog>
      <CreateFeedbackDialog 
        loading={ createFeedbackDialogLoading }
        onClose={ () => setCreateFeedbackDialogOpen(false) }
        onConfirm={ responseData => {
          setCreateFeedbackDialogLoading(true)
          actions.createFeedback(responseData)
            .then(() => {
              setCreateFeedbackDialogLoading(false)
              setCreateFeedbackDialogOpen(false)
              flashSuccess('Feedback created')
            })
            .catch(err => {
              setCreateFeedbackDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createFeedbackDialogOpen }
        session={ session }
      />
      <Paper className={ classes.section }>
        <InfoWidget 
          actions={ session.end_time == null ? [
            {
              color: theme.palette.success.dark,
              icon: 'check_circle',
              onClick: () => {
                actions.finishSession(session.id)
                  .then(() => flashSuccess('Session finished'))
                  .catch(flashError)
              },
              tooltip: 'Finish Session',
            },
            {
              color: theme.palette.error.dark,
              icon: 'cancel',
              onClick: () => setCancelDialogOpen(true),
              tooltip: 'Cancel Session',
            },
          ] : [] }
          lineItems={ [
            { detail: session.id, title: 'ID' },
            { detail: session.skill, title: 'Skill' },
            { detail: getGuide().name, title: 'Guide' },
            { detail: getLearner().name, title: 'Learner' },
            { detail: session.manually_requested ? 'Yes' : 'No', title: 'Manually Requested' },
            { detail: DateUtils.formatDate(session.start_time), title: 'Date' },
            { detail: DateUtils.formatTime(session.start_time), title: 'Start Time' },
            { 
              detail:  DateUtils.areSameDate(session.start_time, session.end_time)
                ? DateUtils.formatTime(session.end_time)
                : DateUtils.formatDateTime(session.end_time),
              title: 'End Time',
            },
            { detail: session.cancellation_reason || 'N/A', title: 'Cancellation Reason' },
          ] }
          title='Session Info'
        />
      </Paper>
      {!session.manually_requested && <div className={ classes.section }>
        <SingleCompletionTable 
          completion={ props.before }
          tableProps={ {
            title: 'Before',
          } }
        />
      </div>}
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
        <FeedbackWidget 
          actions={ [
            {
              tooltip: 'Add Response',
              icon: 'add_box',
              onClick: () => setCreateFeedbackDialogOpen(true),
            },
          ] }
          feedback={ props.feedback }
          title='Session Feedback'
        />
      </Paper>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Session)