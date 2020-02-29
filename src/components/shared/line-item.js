import PropTypes from 'prop-types'
import React from 'react'

import { Box, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}))

function LineItem(props) {
  const classes = useStyles()
  return (
    <div className={ classes.container }>
      <Typography>
        <Box fontWeight='bold'>{props.title}</Box>
      </Typography>
      <Typography>
        <Box>{props.detail}</Box>
      </Typography>
    </div>
  )
}

LineItem.propTypes = {
  title: PropTypes.string.isRequired,
  detail: PropTypes.any,
}

export default LineItem