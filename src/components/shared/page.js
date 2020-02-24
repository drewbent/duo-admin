import PropTypes from 'prop-types'
import React from 'react'

import Loader from 'components/shared/loader'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
}))

/**
 * Might use this later
 */
function Page(props) {
  const classes = useStyles()

  return (
    <div className={ classes.container }>
      {props.loading ? <Loader visible /> : props.children }
    </div>
  )
}

Page.propTypes = {
  loading: PropTypes.bool,
}

export default Page