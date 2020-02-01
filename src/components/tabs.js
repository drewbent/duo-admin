import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import { Tabs as MTabs, Paper, Tab, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    maxWidth: 400,
  },
}))

function Tabs(props) {
  const classes = useStyles()
  const [currentTab, setCurrentTab] = useState('classes')

  const getRouteForTab = tab => {
    switch (tab) {
      case 'classes':
        return '/classes'
      case 'users':
        return '/users'
    }
  }
  
  return (
    <div className={ classes.container }>
      <Paper 
        className={ classes.content }
        square
      >
        <MTabs
          centered
          indicatorColor='primary'
          onChange={ (_, newValue) => {
            props.history.push(getRouteForTab(newValue))
            setCurrentTab(newValue) 
          } }
          value={ currentTab }
          variant='fullWidth'
        >
          <Tab 
            label='Classes' 
            value='classes' 
          />
          <Tab 
            label='Users' 
            value='users'
          />
        </MTabs>
      </Paper>
    </div>
  )
}

export default withRouter(Tabs)