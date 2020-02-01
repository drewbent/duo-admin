import React, { useState } from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'

import { fetchUsers, updateUser } from 'services/users-service'
import { flashError, flashSuccess } from 'components/global-flash'

const mapStateToProps = state => ({
  users: Object.values(state.Users),
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchUsers: fetchUsers(dispatch),
    updateUser: updateUser(dispatch),
  },
})

function Users(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    actions.fetchUsers()
      .catch(flashError)
  }

  return (
    <Page>
      <MaterialTable 
        columns={ [
          { title: 'ID', field: 'id', editable: false },
          { title: 'Name', field: 'name' },
          { title: 'Email', field: 'email', editable: false },
        ] }
        data={ props.users }
        editable={ { 
          onRowUpdate: async rowData => {
            const { email, name } = rowData
            return actions.updateUser(rowData.id, { email, name })
              .then(() => flashSuccess('User updated.'))
              .catch(flashError)
          },
        } }
        options={ {
          actionsColumnIndex: 3,
          pageSize: 10,
        } }
        title='Users'
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)