import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import { TextField } from '@material-ui/core'

function TextFieldDialog(props) {
  const [value, setValue] = useState('')

  const onClose = () => {
    setValue('')
    props.onClose()
  }

  return (
    <ConfirmDialog
      onClose={ onClose }
      onConfirm={ () => props.onConfirm(value) }
      open={ props.open }
      title={ props.title }
    >
      <TextField 
        { ...props.textFieldProps }
        onChange={ e => setValue(e.target.value) }
        value={ value }
      />
    </ConfirmDialog>
  )
}

TextFieldDialog.propTypes = {
  title: PropTypes.string,
  textFieldProps: PropTypes.object,

  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
}

export default TextFieldDialog