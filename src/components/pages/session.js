import React, { useState } from 'react'
import { connect } from 'react-redux'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import CreateFeedbackDialog from 'components/shared/dialogs/create-feedback-dialog'
import FeedbackViewer from 'components/shared/feedback-viewer'
import LineItem from 'components/shared/line-item'
import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TooltipButton from 'components/shared/tooltip-button'
import { AddBox, ChevronLeft, ChevronRight } from '@material-ui/icons'
import { FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Toolbar, Tooltip, Typography, makeStyles, useTheme } from '@material-ui/core'

import { cancelSession, fetchCancellationReasons, fetchSession, finishSession } from 'services/session-service'
import { createFeedback, fetchResponsesForSession } from 'services/response-service'
import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionAfterSession, fetchCompletionBeforeSession } from 'services/completions-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getResponsesForSession } from 'redux/reducers/responses'

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
  noFeedbackText: {
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
  responseQuestion: {
    marginBottom: theme.spacing(2),
  },
  responseSelectBar: {
    display: 'flex',
    alignItems: 'center',
  },
  actionBar: {
    display: 'flex',
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
    responses:  getResponsesForSession(state, sessionId),
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
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0)

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

  const getGuide = () => (
    props.students[props.session.guide_id] || {}
  )
  
  const getLearner = () => (
    props.students[props.session.learner_id] || {}
  )

  const numFeedback = Object.keys(props.responses).length
  const feedbackKeys = Object.keys(props.responses).sort()

  return (
    <Page>
      {props.session 
        ?
        <div>
          <ConfirmDialog
            loading={ cancelDialogLoading }
            onClose={ () => setCancelDialogOpen(false) }
            onConfirm={ () => {
              if (cancellationReason === -1)
                return flashError('Must select a reason')
              
              const data = { cancellation_reason: cancellationReason }
              setCancelDialogLoading(true)
              actions.cancelSession(props.session.id, data)
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
            session={ props.session }
          />
          <Paper className={ classes.section }>
            <Toolbar className={ classes.toolbar }>
              <Typography variant='h5'>
                Session Info
              </Typography>
              {props.session.end_time == null && (
                <div>
                  <TooltipButton
                    color={ theme.palette.success.dark } 
                    icon='check_circle'
                    onClick={ () => {
                      actions.finishSession(props.session.id)
                        .then(() => flashSuccess('Session finished'))
                        .catch(flashError)
                    } }
                    tooltip='Finish Session'
                  />
                  <TooltipButton
                    color={ theme.palette.error.dark } 
                    icon='cancel'
                    onClick={ () => setCancelDialogOpen(true) }
                    tooltip='Cancel Session'
                  />
                </div>
              )}
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
                detail={ DateUtils.formatTime(props.session.start_time) } 
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
            <Toolbar className={ classes.toolbar }>
              <Typography variant='h6'>
                Session Feedback
              </Typography>
              <div className={ classes.actionBar }>
                <div className={ classes.responseSelectBar }>
                  <IconButton
                    disabled={ currentFeedbackIndex <= 0 }
                    onClick={ () => {
                      const nextIndex = Math.max(currentFeedbackIndex - 1, 0)
                      setCurrentFeedbackIndex(nextIndex) 
                    } }
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography>{Math.min(currentFeedbackIndex + 1, numFeedback)} of {numFeedback}</Typography>
                  <IconButton
                    disabled={ currentFeedbackIndex >= numFeedback - 1 }
                    onClick={ () => {
                      const nextIndex = Math.min(currentFeedbackIndex + 1, numFeedback - 1)
                      setCurrentFeedbackIndex(nextIndex)
                    } }
                  >
                    <ChevronRight />
                  </IconButton>
                </div>
                <Tooltip
                  title='Add Response'
                >
                  <IconButton
                    onClick={ () => setCreateFeedbackDialogOpen(true) }
                  >
                    <AddBox />
                  </IconButton>
                </Tooltip>
              </div>
            </Toolbar>
            {
              props.responses ?
                (numFeedback === 0 ?
                  <Typography className={ classes.noFeedbackText }>
                    No feedback for this session.
                  </Typography>
                  :
                  <FeedbackViewer responses={ props.responses[feedbackKeys[currentFeedbackIndex]] } />
                )
                :
                <Typography className={ classes.noFeedbackText }>
                  No feedback for this session.
                </Typography>
            }
          </Paper>
        </div>
        :
        <Loader visible />}
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Session)