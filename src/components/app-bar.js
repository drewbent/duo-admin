import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  AppBar as MAppBar,
  Paper,
  Toolbar, 
  Typography, 
  makeStyles,
} from '@material-ui/core'
import { Person } from '@material-ui/icons'

import { logout } from 'services/auth-service'

// The app bar will be hidden on these routes
const blacklist = ['/login']

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  popoverContainer: {
    height: 1,
    overflow: 'visible',
    position: 'relative',
  },
  popover: {
    position: 'absolute',
    right: theme.spacing(1),
    zIndex: 100,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    cursor: 'pointer',
  },
  logOutText: {
    color: theme.palette.error.main,
  },
}))

const mapStateToProps = state => ({
  ...state.CurrentUser, // has keys 'isLoggedIn' and 'user'
})

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: logout(dispatch),
  },
})

/**
 * This app bar will not appear on blacklisted pages (e.g. login)
 */
function AppBar(props) {
  const { actions } = props
  const classes = useStyles()
  const [popoverOpen, setPopoverOpen] = useState(false)

  if (blacklist.includes(window.location.pathname)) {
    return null
  }

  return (
    <div onMouseLeave={ () => setPopoverOpen(false) }>
      <MAppBar 
        className={ classes.appBar }
        position='sticky'
      >
        <Toolbar className={ classes.topBar }>
          <div>
            <Typography
              className={ classes.title }
              noWrap
              onClick={ () => props.history.push('/') }
              variant='h6'
            >
              Duo Admin
            </Typography>
          </div>
          <IconButton
            aria-haspopup='true'
            aria-owns={ popoverOpen ? 'user-popover' : undefined }
            onClick={ () => {} }
            onMouseEnter={ () => setPopoverOpen(true) }
          >
            <Person />
          </IconButton>
        </Toolbar>
      </MAppBar>
      {props.user && popoverOpen && <div 
        className={ classes.popoverContainer }
        onMouseLeave={ () => setPopoverOpen(false) }
      >
        <Paper className={ classes.popover }>
          <List>
            <ListItem>
              <ListItemText primary={ props.user.email } />
            </ListItem>
            <Divider orientation='horizontal' />
            <ListItem button>
              <ListItemText 
                className={ classes.logOutText }
                onClick={ () => actions.logout() }
                primary='Log Out'
              />
            </ListItem>
          </List>
        </Paper>
      </div>}
    </div>
    
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar))