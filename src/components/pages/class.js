import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'

import { 
  createClassStudents,
  deleteStudent, 
  fetchClassStudents, 
  updateStudent,
} from 'services/class-student-service'
import { fetchClass } from 'services/classes-service'
import { flashError, flashSuccess } from 'components/global-flash'

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
      createClassStudents: data => createClassStudents(dispatch)(classId, data),
      deleteStudent: id => deleteStudent(dispatch)(classId, id),
      fetchClass: () => fetchClass(dispatch)(classId),
      fetchClassStudents: () => fetchClassStudents(dispatch)(classId),
      updateStudent: (id, data) => updateStudent(dispatch)(classId, id, data),
    },
  }
}

function Class(props) {
  const { actions } = props
  const [createMultiDialogOpen, setCreateMultiDialogOpen] = useState(false)
  const [createMultiDialogLoading, setCreateMultiDialogLoading] = useState(false)
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
        loading={ createMultiDialogLoading }
        onClose={ () => setCreateMultiDialogOpen(false) }
        onConfirm={ text => {
          setCreateMultiDialogLoading(true)
          const data = []
          const emailsAndNames = text.split('\n')
          for (const studentData of emailsAndNames) {
            const components = studentData.split(',')
            if (components.length != 2) {
              flashError('Data is malformed')
              return
            } else {
              data.push({ email: components[0], name: components[1] })
            }
          }

          actions.createClassStudents(data)
            .then(() => {
              setCreateMultiDialogOpen(false)
              setCreateMultiDialogLoading(false)
            })
            .catch(err => {
              setCreateMultiDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createMultiDialogOpen }
        textFieldProps={ { 
          autoCapitalize: 'none',
          label: 'Emails & Names',
          multiline: true,
          placeholder: 'Add emails and names with a new line between each one, and a comma separating email from name. For example: \n\nstudent@email.com,Phil Shen',
        } }
        title='Add Student Emails'
      />
      <MaterialTable
        actions={ [
          {
            title: 'Add Multiple Students',
            icon: 'queue',
            isFreeAction: true,
            onClick: () => setCreateMultiDialogOpen(true),
          },
        ] }
        columns={ [
          { title: 'ID', field: 'id', editable: false },
          { title: 'Name', field: 'name' },
          { title: 'Email', field: 'email', editable: false, defaultSort: 'asc' },
          { title: 'Firebase ID', field: 'firebase_id' },
        ] }
        data={ props.students }
        editable={ {
          onRowUpdate: async newData => {
            const { name, email } = newData
            return actions.updateStudent(newData.id, { email, name })
              .then(() => flashSuccess('Student updated.'))
              .catch(flashError)
          },
        } }
        options={ {
          actionsColumnIndex: 4,
          paging: false,
        } }
        title={ `Students for ${props.classSection.name}` }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Class)