import React from 'react'

import { Paper, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
}))

function NotFound() {
  const classes = useStyles()

  return (
    <div className={ classes.container }>
      <Paper className={ classes.paper }>
        <Typography variant='h3'>404: Page Not Found</Typography>
      </Paper>
    </div>
  )
}

export default NotFound
