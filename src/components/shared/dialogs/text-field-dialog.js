import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import { TextField } from '@material-ui/core'

function TextFieldDialog(props) {
  const [value, setValue] = useState(props.initialValue || '')

  const onClose = () => {
    setValue(props.initialValue || '')
    props.onClose()
  }

  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ onClose }
      onConfirm={ () => props.onConfirm(value) }
      open={ props.open }
      title={ props.title }
    >s
      <TextField 
        { ...props.textFieldProps }
        fullWidth
        onChange={ e => setValue(e.target.value) }
        value={ value }
      />
    </ConfirmDialog>
  )
}

TextFieldDialog.propTypes = {
  title: PropTypes.string,
  textFieldProps: PropTypes.object,
  initialValue: PropTypes.string,
  /** Passes the text field value */
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
}

export default TextFieldDialog