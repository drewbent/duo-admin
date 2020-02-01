import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { TextField, makeStyles } from '@material-ui/core'

import { createClass, deleteClass, fetchClasses, updateClass } from 'services/classes-service'
import { flashError, flashSuccess } from 'components/global-flash'

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

const useStyles = makeStyles(theme => ({
  newClassNameField: {
    marginBottom: theme.spacing(1),
  },
}))

function Classes(props) {
  const classes = useStyles()
  const { actions } = props
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogLoading, setCreateDialogLoading] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [newClassKAID, setNewClassKAID] = useState('')
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    actions.fetchClasses()
      .catch(err => flashError(err.message))
  }

  return (
    <Page>
      <ConfirmDialog
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ () => {
          setCreateDialogLoading(true)
          actions.createClass({ name: newClassName, ka_id: newClassKAID })
            .then(() => {
              setCreateDialogLoading(false)
              setCreateDialogOpen(false)
              setNewClassName('')
              setNewClassKAID('')
              flashSuccess('Class created')
            })
            .catch(err => {
              flashError(err.message)
              setCreateDialogLoading(false)
            })
        } }
        open={ createDialogOpen }
        title='Create New Class'
      >
        <TextField 
          autoCapitalize='words'
          className={ classes.newClassNameField }
          fullWidth
          label='Name'
          onChange={ e => setNewClassName(e.target.value) }
          value={ newClassName }
        />
        <TextField 
          autoCapitalize='none'
          fullWidth
          label='Khan Academy ID'
          onChange={ e => setNewClassKAID(e.target.value) }
          value={ newClassKAID }
        />
      </ConfirmDialog>
      <MaterialTable
        actions={ [
          {
            icon: 'add_box',
            isFreeAction: true,
            onClick: () => setCreateDialogOpen(true),
          },
        ] }
        columns={ [
          { title: 'ID', field: 'id', defaultSort: 'asc', editable: false },
          { title: 'Name', field: 'name' },
          { title: 'Khan Academy ID', field: 'ka_id' },
        ] }
        data={ props.classes }
        editable={ {
          onRowDelete: async rowData => {
            if (confirm('ARE YOU SURE?')) {
              actions.deleteClass(rowData.id)
                .then(() => flashSuccess('Class deleted'))
                .catch(err => flashError(err.message))
            }
          },
          onRowUpdate: async rowData => {
            const { name, ka_id } = rowData
            actions.updateClass(rowData.id, { name, ka_id })
              .then(() => flashSuccess('Class updated'))
              .catch(err => flashError(err.message))
          },
        } }
        onRowClick={ (_, rowData) => props.history.push(`/classes/${rowData.id}`) }
        options={ {
          search: false,
          paging: false,
          actionsColumnIndex: 3,
        } }
        title='Class Sections'
      />
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Classes))