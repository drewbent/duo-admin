import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@material-ui/icons'
import { IconButton, Snackbar, SnackbarContent, makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { green } from '@material-ui/core/colors'

import * as actions from 'redux/actions/global-flash'
import store from 'redux/store'

const variantIcon = {
  success: SuccessIcon,
  info: InfoIcon,
  error: ErrorIcon,
}

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const mapStateToProps = state => ({
  flash: state.GlobalFlash,
})

const mapDispatchToProps = {
  hideFlash: actions.hideFlash,
}

function GlobalFlash(props) {
  const { flash, hideFlash } = props
  const classes = useStyles()
  const Icon = variantIcon[flash.variant]

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    hideFlash()
  }

  return (
    <Snackbar
      anchorOrigin={ {
        vertical: 'top',
        horizontal: 'center',
      } }
      autoHideDuration={ flash.duration }
      onClose={ onClose }
      open={ flash.visible }
    >
      <SnackbarContent
        action={ [
          <IconButton aria-label='close'
            color='inherit'
            key='close'
            onClick={ onClose }>
            <CloseIcon className={ classes.icon } />
          </IconButton>,
        ] }
        aria-describedby='global-flash-snackbar'
        className={ clsx(classes[flash.variant], classes.margin) }
        message={
          <span
            className={ classes.message }
            id='global-flash-snackbar'
          >
            <Icon className={ clsx(classes.icon, classes.iconVariant) } />
            {flash.message}
          </span>
        }
      />
    </Snackbar>
  )
}

GlobalFlash.propTypes = {
  flash: PropTypes.object,
  hideFlash: PropTypes.func,
}

// Helper methods
export const flashError = message => {
  let flashMessage = 'Something went wrong'
  if (typeof message == 'string' || message instanceof String)
    flashMessage = message
  else if (message instanceof Error && typeof message.message !== undefined)
    flashMessage = message.message

  store.dispatch(actions.flashError(flashMessage))
}

export const flashSuccess = message => {
  store.dispatch(actions.flashSuccess(message || 'Success'))
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalFlash)