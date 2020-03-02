import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { Cancel, CheckCircle } from '@material-ui/icons'
import { CircularProgress, Typography, makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchSessions } from 'services/session-service'
import { flashError } from 'components/global-flash'
import { formatTime } from 'utils/date-utils'
import { getTodaysSessions } from 'redux/reducers/sessions'

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
  sessions: getTodaysSessions(state).sort((a, b) => Date.parse(b.start_time) - Date.parse(a.start_time)),
  students: state.Students,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchSessions: fetchSessions(dispatch),
    fetchStudents: fetchAllStudents(dispatch),
  },
})

function SessionFeed(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  const fetchSessions = () => actions.fetchSessions().catch(flashError)

  // Start interval
  useEffect(() => {
    fetchSessions()
    const interval = setInterval(() => {
      fetchSessions()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchStudents(),
    ]).catch(flashError)
  }

  return (
    <Page>
      {props.sessions.map(session => (
        <div 
          className={ classes.row }
          key={ session.id }
        >
          <MaterialTable 
            columns={ [
              { title: 'ID', field: 'id' },
              {
                title: 'Start Time',
                render: rowData => formatTime(Date.parse(rowData.start_time)),
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
            ] }
            data={ [session] }
            onRowClick={ (_, rowData) => props.history.push(`/session-feed/sessions/${rowData.id}`) }
            options={ {
              toolbar: false,
              paging: false,
            } }
          />
        </div>
      ))}
      <Typography className={ classes.footerText }>Only sessions from today are displayed.</Typography>
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SessionFeed))