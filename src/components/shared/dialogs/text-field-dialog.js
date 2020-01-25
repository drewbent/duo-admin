import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Loader from 'components/shared/loader'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}))

function TextFieldDialog(props) {
  const classes = useStyles()
  const [value, setValue] = useState('')

  const onClose = () => {
    setValue('')
    props.onClose()
  }

  return (
    <Dialog
      aria-labelledby='create-class-dialog-title'
      onClose={ onClose }
      open={ props.open }
    >
      <Loader visible={ props.loading } />
      <DialogTitle id='create-class-dialog-title'>{props.title}</DialogTitle>
      <TextField 
        { ...props.textFieldProps }
        className={ classes.textField }
        onChange={ e => setValue(e.target.value) }
        value={ value }
      />
      <DialogActions>
        <Button onClick={ onClose }>Cancel</Button>
        <Button onClick={ () => {
          try {
            props.onConfirm(value)
          } catch (error) {
            props.onError(error)
          }
        } }
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

TextFieldDialog.propTypes = {
  title: PropTypes.string,
  textFieldProps: PropTypes.object,

  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
}

export default TextFieldDialog