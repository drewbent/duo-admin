import PropTypes from 'prop-types'
import React, { useState } from 'react'

import FeedbackViewer from 'components/shared/feedback-viewer'
import TooltipButton from 'components/shared/tooltip-button'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import { IconButton, Toolbar, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionBar: {
    display: 'flex',
  },
  responseSelectBar: {
    display: 'flex',
    alignItems: 'center',
  },
  noFeedbackText: {
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
}))

function FeedbackWidget(props) {
  const feedback = props.feedback || []
  const classes = useStyles()
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0)
  
  return (
    <div>
      <Toolbar className={ classes.toolbar }>
        <Typography variant='h6'>
          Session Feedback
        </Typography>
        <div className={ classes.actionBar }>
          <div className={ classes.responseSelectBar }>
            <IconButton
              disabled={ currentFeedbackIndex <= 0 }
              onClick={ () => {
                const nextIndex = Math.max(currentFeedbackIndex - 1, 0)
                setCurrentFeedbackIndex(nextIndex) 
              } }
            >
              <ChevronLeft />
            </IconButton>
            <Typography>
              {Math.min(currentFeedbackIndex + 1, feedback.length)} of {feedback.length}
            </Typography>
            <IconButton
              disabled={ currentFeedbackIndex >= feedback.length - 1 }
              onClick={ () => {
                const nextIndex = Math.min(currentFeedbackIndex + 1, feedback.length - 1)
                setCurrentFeedbackIndex(nextIndex)
              } }
            >
              <ChevronRight />
            </IconButton>
          </div>
          {(props.actions || []).map((config, i) => (
            <TooltipButton 
              key={ i } 
              { ...config } 
            />
          ))}
        </div>
      </Toolbar>
      {(feedback.length === 0 ?
        <Typography className={ classes.noFeedbackText }>
          No feedback to display.
        </Typography>
        :
        <FeedbackViewer feedback={ props.feedback[currentFeedbackIndex] } />
      )}
    </div>
  )
}

FeedbackWidget.propTypes = {
  /**
   * Array of backend feedback objects
   */
  feedback: PropTypes.arrayOf(PropTypes.object),

  /**
   * Array of action objects with keys { color, icon, tooltip, onClick } (matches the
   * props for TooltipButton)
   */
  actions: PropTypes.arrayOf(PropTypes.object),
}

export default FeedbackWidget