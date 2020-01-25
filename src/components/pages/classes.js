import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'

import { createClass, deleteClass, fetchClasses, updateClass } from 'services/classes-service'
import { flashError } from 'components/global-flash'

const mapDispatchToProps = dispatch => ({
  actions: {
    createClass: createClass(dispatch),
    deleteClass: deleteClass(dispatch),
    fetchClasses: fetchClasses(dispatch),
    updateClass: updateClass(dispatch),
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
      <TextFieldDialog
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ name => {
          setCreateDialogLoading(true)
          actions.createClass({ name })
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
        textFieldProps={ {
          autoCapitalize: 'words',
          label: 'Name',
        } }
        title='Create New Class'
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
          { title: 'ID', field: 'id', defaultSort: 'asc', editable: false },
          { title: 'Name', field: 'name' },
        ] }
        data={ props.classes }
        editable={ {
          onRowDelete: async rowData => {
            actions.deleteClass(rowData.id)
              .catch(err => flashError(err.message))
          },
          onRowUpdate: async rowData => {
            actions.updateClass(rowData.id, rowData.name)
              .catch(err => flashError(err.message))
          },
        } }
        onRowClick={ (_, rowData) => props.history.push(`/classes/${rowData.id}`) }
        options={ {
          search: false,
          paging: false,
          actionsColumnIndex: 2,
        } }
        title='Class Sections'
      />
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Classes))