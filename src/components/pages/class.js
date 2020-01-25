import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'

import { createClassStudent, deleteStudent, fetchClassStudents, updateStudent } from 'services/class-student-service'
import { fetchClass } from 'services/classes-service'
import { flashError } from 'components/global-flash'

function getClassId(props) {
  return props.match.params.classId
}

const mapStateToProps = (state, ownProps) => {
  const classId = getClassId(ownProps)

  return {
    classSection: state.Classes[classId],
    students: ((state.ClassStudents[classId] || [])
      .map(studentId => state.Students[studentId]) || [])
      .filter(x => x),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const classId = getClassId(ownProps)

  return {
    actions: {
      createClassStudent: email => createClassStudent(dispatch)(classId, email),
      deleteStudent: id => deleteStudent(dispatch)(classId, id),
      fetchClass: () => fetchClass(dispatch)(classId),
      fetchClassStudents: () => fetchClassStudents(dispatch)(classId),
      updateStudent: (id, email) => updateStudent(dispatch)(classId, id, email),
    },
  }
}

function Class(props) {
  const { actions } = props
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchClass(),
      actions.fetchClassStudents(),
    ])
      .catch(err => flashError(err.message))
  }

  if (props.classSection == null)
    return <Loader visible />

  return (
    <Page>
      <TextFieldDialog 
        loading={ dialogLoading }
        onClose={ () => setDialogOpen(false) }
        onConfirm={ email => {
          setDialogLoading(true)
          actions.createClassStudent(email)
            .then(() => {
              setDialogLoading(false)
              setDialogOpen(false)
            })
            .catch(err => {
              setDialogLoading(false)
              flashError(err)
            })
        } }
        onError={ flashError }
        open={ dialogOpen }
        textFieldProps={ {
          autoCapitalize: 'none',
          label: 'Email',
        } }
        title='Add Student Email'
      />
      <MaterialTable
        actions={ [
          { 
            title: 'Add Student', 
            icon: 'add', 
            isFreeAction: true,
            onClick: () => setDialogOpen(true),
          },
        ] }
        columns={ [
          { title: 'ID', field: 'id' },
          { title: 'Email', field: 'email', defaultSort: 'asc' },
        ] }
        data={ props.students }
        editable={ {
          onRowDelete: async newData => {
            return actions.deleteStudent(newData.id).catch(flashError)
          },
          onRowUpdate: async newData => {
            return actions.updateStudent(newData.id, newData.email).catch(flashError)
          },
        } }
        options={ {
          actionsColumnIndex: 2,
          paging: false,
        } }
        title={ `Students for ${props.classSection.name}` }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Class)