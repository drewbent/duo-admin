import 'utils/string-utils'

import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs as MaterialBreadcrumbs, makeStyles } from '@material-ui/core'
import { withRouter } from 'react-router'

const blacklist = ['/login']

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}))

function Breadcrumbs() {
  const classes = useStyles()
  const pathnames = window.location.pathname.split('/').filter(x => x)

  if (blacklist.includes(window.location.pathname)) {
    return null
  }

  if (pathnames.length === 0) {
    return null
  } else {
    return (
      <div className={ classes.container }>
        <MaterialBreadcrumbs aria-label='breadcrumb'>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1
            const route = `/${pathnames.slice(0, index + 1).join('/')}`

            return (
              <Link
                color={ isLast ? 'textPrimary' : 'inherit' }
                key={ route }
                style={ { textDecoration: 'none' } }
                to={ route }
              >
                {value.replace(/-/g, ' ').toTitleCase()}
              </Link>
            )
          })}
        </MaterialBreadcrumbs>
      </div>
    )
  }
}

export default withRouter(Breadcrumbs)