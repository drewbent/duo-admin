import React, { useState } from 'react'
import { connect } from 'react-redux'

import {
  Divider,
  Drawer,
  Hidden,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar as MAppBar,
  Paper,
  Toolbar, 
  Typography, 
  makeStyles,
  useTheme,
} from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Person } from '@material-ui/icons'

import { logout } from 'services/auth-service'

// The app bar will be hidden on these routes
const blacklist = ['/login']

// Links in the drawer
const links = [
  {
    title: 'Classes',
    icon: 'school',
    route: '/classes',
  },
]

const drawerWidth = 240
const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
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
  },
  logOutText: {
    color: theme.palette.error.main,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    color: 'white',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    paddingLeft: drawerWidth,
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
  const classes = useStyles()
  const theme = useTheme()
  const { actions } = props
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (blacklist.includes(window.location.pathname)) {
    return props.children
  }

  const pathnames = window.location.pathname.split('/').filter(x => x)
  const firstRoute = '/' + (pathnames.length > 0 ? pathnames[0] : '')

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const drawer = (
    <div>
      <div className={ classes.toolbar } />
      <Divider />
      <List>
        {links.map(config => (
          <ListItem button
            component={ Link }
            key={ config.title }
            selected={ config.route === firstRoute }
            to={ config.route }
          >
            <ListItemIcon><Icon>{config.icon}</Icon></ListItemIcon>
            <ListItemText primary={ config.title } />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div onMouseLeave={ () => setPopoverOpen(false) }>
      <MAppBar 
        className={ classes.appBar }
        position='sticky'
      >
        <Toolbar className={ classes.topBar }>
          <div style={ { display: 'flex', alignItems: 'center' } }>
            <IconButton
              aria-label='open drawer'
              className={ classes.menuButton }
              color='inherit'
              edge='start'
              onClick={ handleDrawerToggle }
            >
              <Menu className={ classes.menuButton } />
            </IconButton>
            <Typography
              className={ classes.title }
              noWrap
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
            <Person style={ { color: 'white' } } />
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
      <nav 
        aria-label='mailbox folders'
        className={ classes.drawer }
      >
        <Hidden 
          implementation='css'
          smUp
        >
          <Drawer
            anchor={ theme.direction === 'rtl' ? 'right' : 'left' }
            classes={ {
              paper: classes.drawerPaper,
            } }
            ModalProps={ {
              keepMounted: true, // Better open performance on mobile.
            } }
            onClose={ handleDrawerToggle }
            open={ mobileOpen }
            variant='temporary'
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden 
          implementation='css'
          xsDown
        >
          <Drawer
            classes={ {
              paper: classes.drawerPaper,
            } }
            open
            variant='permanent'
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={ classes.content }>
        {props.children}
      </main>
    </div>
    
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar))