import React, { useState } from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'

import { fetchClassStudent } from 'services/class-student-service'
import { fetchCompletionsForStudent } from 'services/completions-service'
import { flashError } from 'components/global-flash'

const getStudentId = props => (
  props.match.params.studentId
)

const mapStateToProps = (state, ownProps) => {
  const userId = getStudentId(ownProps)

  return {
    user: state.Users[userId] || {},
    completions: (state.UserCompletions[userId] || []).map(id => state.Completions[id])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const studentId = getStudentId(ownProps)
  
  return {
    actions: {
      fetchStudent: () => fetchClassStudent(dispatch)(studentId),
      fetchComplations: () => fetchCompletionsForStudent(dispatch)(studentId),
    },
  }
}

function User(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchStudent(),
      actions.fetchComplations(),
    ]).catch(flashError)
  }

  return (
    <Page>
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
          { title: 'Recorded At', field: 'created_at', defaultSort: 'desc' },
        ] }
        data={ props.completions }
        options={ { 
          pageSize: 10,
        } }
        title={ props.student ? `${props.student.name}'s Skill Completion` : 'Skill Completion' }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(User)