import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import { Dialog } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchClasses } from 'services/classes-service'
import { flashError } from 'components/global-flash'

const mapStateToProps = state => ({
  students: state.Students,
  classes: state.Classes,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAllStudents: fetchAllStudents(dispatch),
    fetchClasses: fetchClasses(dispatch),
  },
})

function SelectStudentDialog(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllStudents(),
      actions.fetchClasses(),
    ]).catch(flashError)
  }
  
  return (
    <Dialog
      onClose={ props.onClose }
      open={ props.open }
    >
      <Loader visible={ props.loading } />
      <MaterialTable 
        columns={ [
          { title: 'Name', field: 'name' },
          { title: 'Class', render: row => (props.classes[row.class_section_id] || {}).name },
        ] }
        data={ Object.values(props.students) }
        onRowClick={ (_, rowData) => {
          props.onSelect(rowData)
        } }
        title={ props.title || 'Select Student' }
      />
    </Dialog>
  )
}

SelectStudentDialog.propTypes = {
  loading: PropTypes.bool,
  open: PropTypes.bool,
  title: PropTypes.string,
  /** Passes the selected student */
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectStudentDialog)