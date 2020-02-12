import React, { useState } from 'react'
import { connect } from 'react-redux'

import LineItem from 'components/shared/line-item'
import Loader from 'components/shared/loader'
import Page from 'components/shared/page'
import { Paper, Toolbar, Typography, makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionAfterSession, fetchCompletionBeforeSession } from 'services/completions-service'
import { fetchSession } from 'services/session-service'
import { flashError } from 'components/global-flash'

import * as DateUtils from 'utils/date-utils'

const getSessionId = props => props.match.params.sessionId

const useStyles = makeStyles(theme => ({
  infoContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    maxWidth: 400,
  },
}))

const mapStateToProps = (state, ownProps) => {
  const sessionId = getSessionId(ownProps)

  return {
    session: state.Sessions[sessionId],
    students: state.Students,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sessionId = getSessionId(ownProps)

  return {
    actions: {
      fetchSession: () => fetchSession(dispatch)(sessionId),
      fetchCompletionBefore: () => fetchCompletionBeforeSession(dispatch)(sessionId),
      fetchCompletionAfter: () => fetchCompletionAfterSession(dispatch)(sessionId),
      fetchStudents: fetchAllStudents(dispatch),
    },
  }
}

function Session(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchSession(),
      actions.fetchCompletionBefore(),
      actions.fetchCompletionAfter(),
      actions.fetchStudents(),
    ]).catch(flashError)
  }

  const getGuide = () => {
    return props.students[props.session.guide_id] || {}
  }
  
  const getLearner = () => {
    return props.students[props.session.learner_id] || {}
  }

  return (
    <Page>
      {props.session 
        ?
        <div>
          <Paper>
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
            </div>
          </Paper>
        </div>
        :
        <Loader visible />}
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Session)