import PropTypes from 'prop-types'
import React, { useState } from 'react'

import ConfirmDialog from 'components/shared/dialogs/confirm-dialog'
import MatchingAlgorithmSelector from 'components/shared/selectors/matching-algorithm-selector'
import { TextField, makeStyles } from '@material-ui/core'

import { flashError } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
}))

function CreateActiveMatchingAlgorithmDialog(props) {
  const classes = useStyles()
  const [key, setKey] = useState('')
  const [algorithmId, setAlgorithmId] = useState(-1)

  const getData = () => {
    if (!key)
      throw new Error('Must provide a key')
    
    if (algorithmId === -1)
      throw new Error('Must select a matching algorithm')

    return {
      key,
      matching_algorithm_id: algorithmId,
    }
  }

  return (
    <ConfirmDialog
      loading={ props.loading }
      onClose={ props.onClose }
      onConfirm={ () => {
        try {
          const data = getData()
          props.onConfirm(data)
        } catch (error) {
          flashError(error)
        }
      } }
      open={ props.open }
      title='Activate Matching Algorithm'
    >
      <TextField 
        className={ classes.field }
        fullWidth
        label='Key'
        onChange={ e => setKey(e.target.value) }
        required
        value={ key }
      />
      <MatchingAlgorithmSelector 
        onChange={ setAlgorithmId }
        shouldFetchData={ props.shouldFetchData }
        value={ algorithmId }
      />
    </ConfirmDialog>
  )
}

CreateActiveMatchingAlgorithmDialog.propTypes = {
  shouldFetchData: PropTypes.bool,
  loading: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  /** Passes data for the new ActiveMatchingAlgorithm record */
  onConfirm: PropTypes.func,
}

export default CreateActiveMatchingAlgorithmDialog

