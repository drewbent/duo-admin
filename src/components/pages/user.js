import React, { useState } from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'

import { fetchCompletionsForUser } from 'services/completions-service'
import { fetchUser } from 'services/users-service'
import { flashError } from 'components/global-flash'

const getUserId = props => (
  props.match.params.userId
)

const mapStateToProps = (state, ownProps) => {
  const userId = getUserId(ownProps)

  return {
    user: state.Users[userId] || {},
    completions: (state.UserCompletions[userId] || []).map(id => state.Completions[id])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const userId = getUserId(ownProps)
  
  return {
    actions: {
      fetchUser: () => fetchUser(dispatch)(userId),
      fetchComplations: () => fetchCompletionsForUser(dispatch)(userId),
    },
  }
}

function User(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchUser(),
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
          { title: 'Recorded From', field: 'recorded_from' },
          { title: 'Time', field: 'created_at' },
        ] }
        data={ props.completions }
        title={ props.user ? `${props.user.name}'s Skill Completion` : 'Skill Completion' }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(User)