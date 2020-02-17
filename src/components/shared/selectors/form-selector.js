import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

import { fetchAllForms } from 'services/form-service'
import { flashError } from 'components/global-flash'

const mapStateToProps = state => ({
  forms: state.Forms,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchForms: fetchAllForms(dispatch),
  },
})

function FormSelector(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchForms(),
    ]).catch(flashError)
  }
  
  return (
    <FormControl fullWidth>
      <InputLabel id='class-selector-label'>Form</InputLabel>
      <Select
        onChange={ e => props.onChange(e.target.value) }
        value={ props.value }
      >
        <MenuItem value={ -1 }><em>None</em></MenuItem>
        {Object.values(props.forms).map(c => (
          <MenuItem
            key={ c.id }
            value={ c.id }
          >
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

FormSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormSelector)