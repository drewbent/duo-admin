import PropTypes from 'prop-types'
import React from 'react'

import Loader from 'components/shared/loader'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: 600,
  },
  content: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}))

function ConfirmDialog(props) {
  const classes = useStyles()

  return (
    <Dialog 
      aria-labelledby='dialog-title'
      onClose={ props.onClose }
      open={ props.open }
    >
      <div className={ classes.container }>
        <Loader visible={ props.loading } />
        <DialogTitle id='dialog-title'>{props.title}</DialogTitle>
        <div className={ classes.content }>
          {props.children}
        </div>
        <DialogActions>
          <Button onClick={ props.onClose }>Cancel</Button>
          <Button onClick={ props.onConfirm }>Confirm</Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
}

export default ConfirmDialog