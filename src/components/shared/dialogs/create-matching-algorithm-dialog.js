import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import { TextField, makeStyles } from '@material-ui/core'

import { flashError } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
}))

function CreateMatchingAlgorithmDialog(props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')
  const [args, setArgs] = useState('')

  const getAlgorithm = () => {
    if (!name) 
      throw new Error('Must provide a name')

    if (!query) 
      throw new Error('Must provide a query')

    const argumentList = args.split(',')
    console.log('What/?')
    return {
      name,
      description,
      sql_query: query,
      arguments: argumentList,
    }
  }

  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      onConfirm={ () => {
        try {
          const alg = getAlgorithm()
          props.onConfirm(alg)
        } catch (error) {
          flashError(error)
        }
      } }
      open={ props.open }
      title='Create Matching Algorithm'
    >
      <TextField 
        className={ classes.field }
        fullWidth
        label='Name'
        onChange={ e => setName(e.target.value) }
        required
        value={ name }
      />
      <TextField 
        className={ classes.field }
        fullWidth
        label='Description'
        onChange={ e => setDescription(e.target.value) }
        value={ description }
      />
      <TextField 
        className={ classes.field }
        fullWidth
        helperText='PSQL. Use Python formatters where arguments should be inserted.'
        label={ 'Query' }
        multiline
        onChange={ e => setQuery(e.target.value) }
        placeholder='SELECT * FROM...'
        required
        value={ query }
      />
      <TextField 
        className={ classes.field }
        fullWidth
        helperText='Comma separated arguments.'
        label='Arguments'
        onChange={ e => setArgs(e.target.value) }
        placeholder='class_id,student_id...'
        required
        value={ args }
      />
    </ConfirmDialog>
  )
}

CreateMatchingAlgorithmDialog.propTypes = {
  onClose: PropTypes.func,
  /**
   * Passes the matching algorithm data
   */
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
}

export default CreateMatchingAlgorithmDialog