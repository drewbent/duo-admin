import PropTypes from 'prop-types'
import React from 'react'

import {
  Icon,
  IconButton,
  Tooltip,
} from '@material-ui/core'

function TooltipButton(props) {
  return (
    <Tooltip
      title={ props.tooltip }
    >
      <IconButton
        onClick={ props.onClick }
        style={ { color: props.color } }
      >
        <Icon>{props.icon}</Icon>
      </IconButton>
    </Tooltip>
  )
}

TooltipButton.propTypes = {
  color: PropTypes.string,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
}

export default TooltipButton