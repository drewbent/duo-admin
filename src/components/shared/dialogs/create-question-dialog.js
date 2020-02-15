import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import LinearScaleCreator from 'components/shared/linear-scale-creator'
import { FormControl, InputLabel, MenuItem, Select, TextField, makeStyles } from '@material-ui/core'

import { fetchQuestionTypes } from 'services/question-service'
import { flashError } from 'components/global-flash'

import QuestionType from 'models/question-type'

const useStyles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = state => ({
  questionTypes: state.QuestionTypes,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchQuestionTypes: fetchQuestionTypes(dispatch),
  },
})

function CreateQuestionDialog(props) {
  const classes = useStyles()
  const { actions } = props
  const [linearScaleInfo, setLinearScaleInfo] = useState(null)
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [question, setQuestion] = useState('')
  const [questionType, setQuestionType] = useState('')

  if (!hasFetchedData) {
    setHasFetchedData(true)
    actions.fetchQuestionTypes().catch(flashError)
  }

  const getOptions = () => {
    switch (questionType) {
      case QuestionType.LINEAR_SCALE:
        const min = linearScaleInfo.min.value
        const max = linearScaleInfo.max.value

        if (max <= min)
          throw new Error('Max must be greater than min.')

        if (min < 1)
          throw new Error('Min may not be less than 1')

        const options = []
        for (let i = min; i <= max; i++) {
          options.push({
            value: i,
            text: i.toString(),
          })
        }

        const minLabel = linearScaleInfo.min.label
        if (minLabel) options[0].text = `${min} (${minLabel})`

        const maxLabel = linearScaleInfo.max.label
        if (maxLabel) options[options.length - 1].text = `${max} (${maxLabel})`
        return options
      default:
        return null
    }
  }

  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      onConfirm={ () => {
        try {
          if (!question)
            throw new Error('Must enter a question.')
          
          if (!questionType)
            throw new Error('Must select a question type.')

          const questionData = {
            question,
            question_type: questionType,
            options: getOptions(),
          }

          props.onConfirm(questionData)
        } catch (error) {
          flashError(error)
        }
      } }
      open={ props.open }
      title='Create Question'
    >
      <TextField
        className={ classes.row }
        fullWidth
        label='Question'
        multiline
        onChange={ e => setQuestion(e.target.value) }
        value={ question }
      />
      <FormControl fullWidth>
        <InputLabel id='question-type-helper-label'>Question Type</InputLabel>
        <Select
          className={ classes.row }
          labelId='question-type-helper-label'
          onChange={ e => setQuestionType(e.target.value) }
          value={ questionType }
        >
          <MenuItem value=''><em>None</em></MenuItem>
          {props.questionTypes.map(type => (
            <MenuItem 
              key={ type }
              value={ type }
            >
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {questionType === QuestionType.LINEAR_SCALE && <LinearScaleCreator 
        onChange={ setLinearScaleInfo }
      />}
    </ConfirmDialog>
  )
}

CreateQuestionDialog.propTypes = {
  loading: PropTypes.bool,

  /** Has one parameter: an object w/ formatted question data */
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionDialog)