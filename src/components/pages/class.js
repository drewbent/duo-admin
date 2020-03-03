import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'
import { makeStyles } from '@material-ui/core'

import { 
  createClassStudents,
  deleteStudent, 
  fetchClassStudents, 
  updateStudent,
} from 'services/class-student-service'
import { fetchClass } from 'services/classes-service'
import { fetchSessionsForClass } from 'services/session-service'
import { fetchSkillsForClass } from 'services/skill-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getSessionsForClass } from 'redux/reducers/sessions'
import { getSlugFromSkill } from '../../utils/skill-utils'

import { formatDateTime } from 'utils/date-utils'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

function getClassId(props) {
  return parseInt(props.match.params.classId, 10)
}

const mapStateToProps = (state, ownProps) => {
  const classId = getClassId(ownProps)
  const allStudents = state.Students

  return {
    classSection: state.Classes[classId],
    students: ((state.ClassStudents[classId] || [])
      .map(studentId => allStudents[studentId]) || [])
      .filter(x => x),
    allStudents,
    sessions: getSessionsForClass(state, classId),
    skills: state.ClassSkills[classId] || [],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const classId = getClassId(ownProps)

  return {
    actions: {
      createClassStudents: data => createClassStudents(dispatch)(classId, data),
      deleteStudent: id => deleteStudent(dispatch)(classId, id),
      fetchClass: () => fetchClass(dispatch)(classId),
      fetchSessions: () => fetchSessionsForClass(dispatch)(classId),
      fetchSkills: () => fetchSkillsForClass(dispatch)(classId),
      fetchClassStudents: () => fetchClassStudents(dispatch)(classId),
      updateStudent: (id, data) => updateStudent(dispatch)(classId, id, data),
    },
  }
}

function Class(props) {
  const { actions } = props
  const classId = getClassId(props)
  const classes = useStyles()
  const [createMultiDialogOpen, setCreateMultiDialogOpen] = useState(false)
  const [createMultiDialogLoading, setCreateMultiDialogLoading] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchClass(),
      actions.fetchClassStudents(),
      actions.fetchSessions(),
      actions.fetchSkills(),
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
      <div className={ classes.section }>
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
          onRowClick={ (_, rowData) => props.history.push(`/classes/${classId}/students/${rowData.id}`) }
          options={ {
            actionsColumnIndex: 4,
            pageSize: 5,
          } }
          title={ `Students in ${props.classSection.name}` }
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Skill', field: 'skill' },
            {
              title: 'Guide',
              render: rowData => (props.allStudents[rowData.guide_id] || {}).name,
            },
            {
              title: 'Learner',
              render: rowData => (props.allStudents[rowData.learner_id] || {}).name,
            },
            {
              title: 'Start',
              render: rowData => formatDateTime(rowData.start_time),
              customSort: (a, b) => Date.parse(a.start_time) - Date.parse(b.start_time),
              defaultSort: 'desc',
            },
            {
              title: 'End',
              render: rowData => rowData.end_time ? formatDateTime(rowData.end_time) : '',
            },
            {
              title: 'Cancelled',
              render: rowData => rowData.end_time ? (rowData.cancellation_reason ? 'True' : 'False') : '',
            },
          ] }
          data={ props.sessions }
          onRowClick={ (_, rowData) => props.history.push(`/classes/${classId}/sessions/${rowData.id}`) }
          title='Sessions'
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable
          columns={ [
            { title: 'Skill', field: 'name' },
          ] }
          data={ props.skills.map(skill => ({ name: skill })) }
          onRowClick={ (_, row) => 
            props.history.push(`/classes/${classId}/skills/${getSlugFromSkill(row.name)}`) 
          }
          options={ {
            paging: false,
          } }
          title='Skills'
        />
      </div>
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Class))