import PropTypes from 'prop-types'
import React from 'react'

import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  container: {
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
}))

function Loader(props) {
  const classes = useStyles()

  if (props.visible)
    return (
      <div className={ classes.container }>
        <CircularProgress />
      </div>
    )
  else
    return null
}

Loader.propTypes = {
  visible: PropTypes.bool,
}

export default Loader