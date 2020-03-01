import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ArgCreator from 'components/shared/controls/arg-creator'
import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import { Button, TextField, makeStyles } from '@material-ui/core'

import { areObjectElementsEqual } from 'utils/array-utils'
import { flashError } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
}))

function CreateMatchingAlgorithmDialog(props) {
  const classes = useStyles()
  const initialData = props.initialData || {}
  const [name, setName] = useState(initialData.name || '')
  const [description, setDescription] = useState(initialData.description || '')
  const [query, setQuery] = useState(initialData.sql_query || '')
  const [args, setArgs] = useState(initialData.args || [])

  const getAlgorithm = () => {
    if (!name) 
      throw new Error('Must provide a name')

    if (!query) 
      throw new Error('Must provide a query')

    for (const arg of args) {
      if (!arg.type || !arg.field)
        throw new Error('Must provide a type and field for each argument')
    }

    // If initialData provided, only pass the fields that changed
    const data = {}
    const isEditing = props.initialData != null

    if (!isEditing || name !== props.initialData.name) 
      data.name = name
    
    if (!isEditing || description !== props.initialData.description) 
      data.description = description

    if (!isEditing || query !== props.initialData.sql_query)
      data.sql_query = query

    if (!isEditing || !areObjectElementsEqual(props.initialData.args || [], args))
      data.args = args

    return data
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
        helperText='PSQL. Use %s where arguments should be inserted.'
        label={ 'Query' }
        multiline
        onChange={ e => setQuery(e.target.value) }
        placeholder='SELECT * FROM...'
        required
        value={ query }
      />
      {args.map((arg, index) => (
        <ArgCreator
          actions={ [
            {
              tooltip: 'Remove',
              icon: 'delete_outline',
              onClick: () => {
                const newArgs = [ ...args ]
                newArgs.splice(index, 1)
                setArgs(newArgs)
              },
            },
          ] }
          className={ classes.field }
          key={ index }
          onChange={ newValue => {
            const newArgs = [ ...args ]
            newArgs[index] = newValue
            setArgs(newArgs)
          } }
          value={ arg }
        />
      ))}
      <Button
        onClick={ () => setArgs([ ...args, {} ]) }
        variant='outlined'
      >
        Add Argument
      </Button>
    </ConfirmDialog>
  )
}

CreateMatchingAlgorithmDialog.propTypes = {
  onClose: PropTypes.func,
  /**
   * Passes the algorithm data, matching the backend format. If an existing
   * algorithm is passed to the initialData prop, this will only return fields
   * that have been updated.
   */
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,

  /**
   * An existing algorithm object. Setting this prop will edit
   */
  initialData: PropTypes.object,
}

export default CreateMatchingAlgorithmDialog