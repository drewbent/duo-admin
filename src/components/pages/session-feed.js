import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ClassSelector from 'components/shared/selectors/class-selector'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { Cancel, CheckCircle } from '@material-ui/icons'
import { CircularProgress, Typography, makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionAfterSession, fetchTodaysCompletions } from 'services/completions-service'
import { fetchSessions } from 'services/session-service'
import { flashError } from 'components/global-flash'
import { formatTime, sortDatesForObjects } from 'utils/date-utils'
import { getAfter, getTodaysSessions } from 'redux/reducers/sessions'
import { isStudentInClass } from 'redux/reducers/students'

const useStyles = makeStyles(theme => ({
  footerText: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
  row: {
    marginBottom: theme.spacing(2),
  },
  cancelledIcon: {
    color: theme.palette.error.dark,
  },
  finishedIcon: {
    color: theme.palette.success.dark,
  },
}))

const mapStateToProps = state => ({
  sessions: getTodaysSessions(state)
    .sort(sortDatesForObjects('start_time', false))
    .map(session => ({ ...session, after: getAfter(state, session.id) })),
  students: state.Students,
  completions: state.Completions,
  isStudentInClass: (studentId, classId) => isStudentInClass(state, studentId, classId),
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAfter: fetchCompletionAfterSession(dispatch),
    fetchTodaysCompletions: fetchTodaysCompletions(dispatch),
    fetchSessions: fetchSessions(dispatch),
    fetchStudents: fetchAllStudents(dispatch),
  },
})

function SessionFeed(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [classFilter, setClassFilter] = useState(-1)

  const fetchSessions = () => actions.fetchSessions().catch(flashError)
  const fetchCompletions = () => actions.fetchTodaysCompletions().catch(flashError)

  // Start interval
  useEffect(() => {
    fetchSessions()
    fetchCompletions()
    const interval = setInterval(() => {
      fetchSessions()
      fetchCompletions()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Track & fetch 'afters'
  const fetchingAfterFor = useRef(null)
  useEffect(() => {
    fetchingAfterFor.current = {}
  }, [])

  useEffect(() => {
    props.sessions.forEach(session => {
      if (!session.after && !fetchingAfterFor.current[session.id]) {
        fetchingAfterFor.current[session.id] = true
        actions.fetchAfter(session.id)
          .then(() => {
            fetchingAfterFor.current[session.id] = false
          })
          .catch(err => {
            fetchingAfterFor.current[session.id] = false
            flashError(err)
          })
      }
    })
  }, [props.sessions])

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchStudents(),
    ]).catch(flashError)
  }

  return (
    <Page>
      <div className={ classes.row }>
        <ClassSelector 
          nullValueText='All'
          onChange={ setClassFilter }
          title='Filter Class'
          value={ classFilter }
        />
      </div>
      {props.sessions
        .filter(session => (
          classFilter == -1 || props.isStudentInClass(session.learner_id, classFilter)
        ))
        .map(session => (
          <div 
            className={ classes.row }
            key={ session.id }
          >
            <MaterialTable 
              columns={ [
                { title: 'ID', field: 'id' },
                {
                  title: 'Start Time',
                  render: rowData => formatTime(rowData.start_time),
                },
                { title: 'Skill', field: 'skill' },
                { 
                  title: 'Guide',
                  render: rowData => (props.students[rowData.guide_id] || {}).name,
                },
                {
                  title: 'Learner',
                  render: rowData => (props.students[rowData.learner_id] || {}).name,
                },
                { 
                  title: 'Manually Requested', 
                  render: rowData => rowData.manually_requested ? 'Yes' : 'No',
                },
                {
                  title: 'Status',
                  render: rowData => {
                    if (rowData.cancellation_reason)
                      return <Cancel className={ classes.cancelledIcon } />
                    else if (rowData.end_time)
                      return <CheckCircle className={ classes.finishedIcon } />
                    else
                      return <CircularProgress size={ 24 } />
                  },
                },
                {
                  title: 'Taught',
                  render: rowData => {
                    const { after } = rowData
                    if (after == null || after.questions_out_of == null) return ''

                    return after.questions_correct === after.questions_out_of 
                      ? '✅'
                      : '❌'
                  },
                },
              ] }
              data={ [session] }
              onRowClick={ (_, rowData) => props.history.push(`/session-feed/sessions/${rowData.id}`) }
              options={ {
                toolbar: false,
                paging: false,
              } }
            />
          </div>
        ))
      }
      <Typography className={ classes.footerText }>Only sessions from today are displayed.</Typography>
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SessionFeed))