import React from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'

import { logout } from 'services/auth-service'

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: logout(dispatch),
  },
})

function Classes(props) {
  const { actions } = props

  const sections = [
    {
      name: 'KLS Algebra II',
      students: 10,
    },
    {
      name: 'ODA Algebra II',
      students: 12,
    },
  ]

  return (
    <Page>
      <MaterialTable
        columns={ [
          { title: 'Section', field: 'name', defaultSort: 'asc' },
          { title: '# Students', field: 'students' },
        ] }
        data={ sections }
        options={ {
          search: false,
          paging: false,
        } }
        title='Class Sections'
      />
    </Page>
  )
}

export default connect(null, mapDispatchToProps)(Classes)