import 'date-fns'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ClassSelector from 'components/shared/selectors/class-selector'
import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import DateFnsUtils from '@date-io/date-fns'
import FormSelector from 'components/shared/selectors/form-selector'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core'

import { flashError } from 'components/global-flash'
import { formatDateBackend } from 'utils/date-utils'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

function CreateDistributionDialog(props) {
  const classes = useStyles()
  const initialData = props.initialData || {}
  const [formId, setFormId] = useState(initialData.form_id || -1)
  const [classId, setClassId] = useState(initialData.class_id || -1)
  const [date, setDate] = useState(new Date())

  const getDistribution = () => {
    if (classId === -1)
      throw new Error('Must select a class.')

    if (formId === -1)
      throw new Error('Must select a form.')
    
    return {
      class_section_id: classId,
      form_id: formId,
      applicable_date: formatDateBackend(date),
    }
  }
  
  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      onConfirm={ () => {
        try {
          const distribution = getDistribution()
          props.onConfirm(distribution)
        } catch (error) {
          flashError(error)
        }
      } }
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
      <div className={ classes.section }>
        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
          <KeyboardDatePicker 
            label='Applicable Date'
            onChange={ setDate }
            value={ date }
            variant='inline'
          />
        </MuiPickersUtilsProvider>
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