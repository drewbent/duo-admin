import React from 'react'

import { AppBar as MAppBar, Toolbar, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  topBar: {

  },
  title: {
    color: 'white',
  },
}))

function AppBar() {
  const classes = useStyles()

  return (
    <MAppBar 
      className={ classes.appBar }
      position='sticky'
    >
      <Toolbar className={ classes.topBar }>
        <div>
          <Typography
            className={ classes.title }
            noWrap
            variant='h6'
          >
            Duo Admin
          </Typography>
        </div>
      </Toolbar>
    </MAppBar>
  )
}

export default AppBar