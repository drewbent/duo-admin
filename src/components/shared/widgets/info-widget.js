import PropTypes from 'prop-types'
import React from 'react'

import LineItem from 'components/shared/line-item'
import TooltipButton from 'components/shared/tooltip-button'
import { Toolbar, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  infoContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    maxWidth: 500,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

function InfoWidget(props) {
  const classes = useStyles()

  return (
    <div>
      <Toolbar className={ classes.toolbar }>
        <Typography variant='h5'>
          {props.title}
        </Typography>
        <div>
          {(props.actions || []).map(action => (
            <TooltipButton { ...action } />
          ))}
        </div>
      </Toolbar>
      <div className={ classes.infoContainer }>
        {(props.lineItems || []).map(lineItem => (
          <LineItem { ...lineItem } />
        ))}
      </div>
    </div>
  )
}

InfoWidget.propTypes = {
  title: PropTypes.string,
  /**
   * List of objects with format { detail: string, title: string }. Matches the 
   * props for `LineItem`
   */
  lineItems: PropTypes.arrayOf(PropTypes.object),

  /**
   * List of objects that contain props for `TooltipButton`.
   */
  actions: PropTypes.arrayOf(PropTypes.object),
}

export default InfoWidget