import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreateClassDialog from 'components/shared/dialogs/create-class-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'

import { createClass, fetchClasses } from 'services/classes-service'
import { flashError } from 'components/global-flash'

const mapDispatchToProps = dispatch => ({
  actions: {
    createClass: createClass(dispatch),
    fetchClasses: fetchClasses(dispatch),
  },
})

const mapStateToProps = state => ({
  classes: Object.values(state.Classes),
})

function Classes(props) {
  const { actions } = props
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogLoading, setCreateDialogLoading] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    actions.fetchClasses()
      .catch(err => flashError(err.message))
  }

  return (
    <Page>
      <CreateClassDialog
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ classData => {
          setCreateDialogLoading(true)
          actions.createClass(classData)
            .then(() => {
              setCreateDialogLoading(false)
              setCreateDialogOpen(false)
            })
            .catch(err => {
              flashError(err.message)
              setCreateDialogLoading(false)
            })
        } }
        onError={ error => flashError(error.message) }
        open={ createDialogOpen }
      />
      <MaterialTable
        actions={ [
          {
            icon: 'add',
            isFreeAction: true,
            onClick: () => setCreateDialogOpen(true),
          },
        ] }
        columns={ [
          { title: 'ID', field: 'id', defaultSort: 'asc' },
          { title: 'Name', field: 'name' },
        ] }
        data={ props.classes }
        options={ {
          search: false,
          paging: false,
        } }
        title='Class Sections'
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Classes)