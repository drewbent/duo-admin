import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  loaderContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  textField: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}))

function CreateClassDialog(props) {
  const classes = useStyles()
  const [name, setName] = useState('')

  const onClose = () => {
    setName('')
    props.onClose()
  }

  const getClass = () => {
    if (!name)
      throw new Error('Must enter a name.')
    
    return { name }
  }

  return (
    <Dialog
      aria-labelledby='create-class-dialog-title'
      onClose={ onClose }
      open={ props.open }
    >
      {props.loading && <div className={ classes.loaderContainer }>
        <CircularProgress />
      </div>}
      <DialogTitle id='create-class-dialog-title'>Create New Class</DialogTitle>
      <TextField 
        autoCapitalize='words'
        className={ classes.textField }
        label='Name'
        onChange={ e => setName(e.target.value) }
        value={ name }
      />
      <DialogActions>
        <Button onClick={ onClose }>Cancel</Button>
        <Button onClick={ () => {
          try {
            const newClass = getClass()
            props.onConfirm(newClass)
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

CreateClassDialog.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
}

export default CreateClassDialog