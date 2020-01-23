import React from 'react'

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
      {props.children}
    </div>
  )
}

export default Page