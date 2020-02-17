import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ClassSelector from 'components/shared/selectors/class-selector'
import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import FormSelector from 'components/shared/selectors/form-selector'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

function CreateDistributionDialog(props) {
  const classes = useStyles()
  const [formId, setFormId] = useState(-1)
  const [classId, setClassId] = useState(-1)
  const [date, setDate] = useState(new Date())
  
  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      open={ props.open }
      title={ props.title || 'Create Distribution' }
    >
      <div className={ classes.section }>
        <ClassSelector 
          onChange={ id => setClassId(id) }
          value={ classId }
        />
      </div>
      <div className={ classes.section }>
        <FormSelector 
          onChange={ id => setFormId(id) }
          value={ formId }
        />
      </div>
    </ConfirmDialog>
  )
}

CreateDistributionDialog.propTypes = {
  initialData: PropTypes.object,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  /** Passes the distribution data */
  onConfirm: PropTypes.func,
}

export default CreateDistributionDialog