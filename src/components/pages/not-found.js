import React from 'react'
import { withRouter } from 'react-router-dom'

import { Button, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(4),
    color: 'white',
  },
}))

function NotFound(props) {
  const classes = useStyles()

  return (
    <div className={ classes.container }>
      <Typography variant='h3'>
        404: Page Not Found
      </Typography>
      <Button
        className={ classes.button }
        color='primary'
        onClick={ () => props.history.push('/') }
        variant='contained'
      >
        Back to Home
      </Button>
    </div>
  )
}

export default withRouter(NotFound)
