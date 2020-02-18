/**
 * @fileoverview Displays an example UI for a "question" entity
 */
import PropTypes from 'prop-types'
import React from 'react'

import QuestionType from 'models/question-type'
import { MenuItem, Select, TextField, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  questionText: {
    // marginBottom: theme.spacing(1),
  },
  container: {
    marginBottom: theme.spacing(2),
  },
}))

function FeedbackQuestion(props) {
  const classes = useStyles()
  const { data: { question, formQuestion } } = props
  
  const renderInput = () => {
    switch (question.question_type) {
      case QuestionType.SHORT_TEXT:
        return (
          <TextField 
            fullWidth
            onChange={ e => props.onChange(e.target.value) }
            placeholder='Short Text'
            value={ props.value }
          />
        )
      case QuestionType.LONG_TEXT:
        return (
          <TextField
            fullWidth
            multiline
            onChange={ e => props.onChange(e.target.value) }
            placeholder='Long Text'
            value={ props.value }
          />
        )
      case QuestionType.LINEAR_SCALE:
        return (
          <Select
            fullWidth
            onChange={ e => props.onChange(e.target.value) }
            value={ props.value || -1 }
          >
            <MenuItem value={ -1 }><em>None</em></MenuItem>
            {question.options.map(option => (
              <MenuItem
                key={ option.value }
                value={ option.value }
              >
                {option.text}
              </MenuItem>
            ))}
          </Select>
        )
      default:
        return <Typography><em>Not Supported</em></Typography>
    }
  }

  return (
    <div className={ classes.container }>
      <Typography className={ classes.questionText }>
        {question.question}{formQuestion.required ? '*' : ''}
      </Typography>
      {renderInput()}
    </div>
  )
}

FeedbackQuestion.propTypes = {
  /**
   * Passes the response (a string)
   */
  onChange: PropTypes.func,
  value: PropTypes.any,
  /**
   * Data should be an object with key/values { question, formQuestion }
   */
  data: PropTypes.object,
}

export default FeedbackQuestion