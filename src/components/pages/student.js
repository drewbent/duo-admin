import React, { useState } from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchCompletionsForStudent } from 'services/completions-service'
import { fetchSessionsForStudent } from 'services/session-service'
import { flashError } from 'components/global-flash'
import { formatDateTime, sortDatesForObjects } from 'utils/date-utils'
import { getSessionsForStudent } from 'redux/reducers/sessions'

const getStudentId = props => parseInt(props.match.params.studentId, 10)

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => {
  const studentId = getStudentId(ownProps)

  return {
    completions: (state.UserCompletions[studentId] || []).map(id => state.Completions[id]),
    sessions: getSessionsForStudent(state, studentId),
    students: state.Students,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const studentId = getStudentId(ownProps)
  
  return {
    actions: {
      fetchStudents: fetchAllStudents(dispatch),
      fetchComplations: () => fetchCompletionsForStudent(dispatch)(studentId),
      fetchSessions: () => fetchSessionsForStudent(dispatch)(studentId),
    },
  }
}

function User(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchStudents(),
      actions.fetchComplations(),
      actions.fetchSessions(),
    ]).catch(flashError)
  }

  const studentId = getStudentId(props)
  const student = props.students[studentId] || {}

  return (
    <Page>
      <div className={ classes.section }>
        <MaterialTable
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Course', field: 'course' },
            { title: 'Unit', field: 'unit' },
            { title: 'Skill', field: 'skill' },
            { title: 'Mastery Category', field: 'mastery_category' },
            { title: '# Correct', field: 'questions_correct' },
            { title: '# Questions', field: 'questions_out_of' },
            { title: 'Mastery Points', field: 'mastery_points' },
            { title: 'Recorded From', field: 'recorded_from' },
            { title: 'Recorded At', field: 'created_at' },
          ] }
          data={ props.completions }
          options={ { 
            sorting: true,
          } }
          title={ `${student.name}'s Skill Completion` }
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable 
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Role', render: row => row.learner_id === studentId ? 'Learner' : 'Guide' },
            { title: 'Partner', render: row => {
              const isGuide = row.guide_id === studentId
              let partner = undefined
              if (isGuide) {
                partner = props.students[row.learner_id] || {} 
              } else {
                partner = props.students[row.guide_id] || {}
              }

              return partner.name
            } },
            { title: 'Skill', field: 'skill' },
            { 
              title: 'Start Time', 
              render: row => formatDateTime(row.start_time),
              customSort: sortDatesForObjects('start_time'),
              defaultSort: 'desc',
            },
            { title: 'Cancelled', render: row => (!!row.cancellation_reason).toString() },
          ] }
          data={ props.sessions }
          title='Sessions'
        />
      </div>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(User)