import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

import { fetchAllForms } from 'services/form-service'
import { fetchClasses } from 'services/classes-service'
import { fetchDistributions } from 'services/distribution-service'
import { flashError } from 'components/global-flash'
import { formatDate } from 'utils/date-utils'

const mapStateToProps = state => ({
  distributions: state.Distributions,
  forms: state.Forms,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchClasses: fetchClasses(dispatch),
    fetchDistributions: fetchDistributions(dispatch),
    fetchAllForms: fetchAllForms(dispatch),
  },
})

function DistributionSelector(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllForms(),
      actions.fetchDistributions(),
      actions.fetchClasses(),
    ]).catch(flashError)
  }
  
  return (
    <FormControl 
      className={ props.className }
      fullWidth
    >
      <InputLabel id='class-selector-label'>Distribution</InputLabel>
      <Select
        onChange={ e => {
          props.onChange(props.distributions[e.target.value] || null)
        } }
        value={ props.value }
      >
        <MenuItem value={ -1 }><em>None</em></MenuItem>
        {Object.values(props.distributions).map(d => (
          <MenuItem
            key={ d.id }
            value={ d.id }
          >
            {formatDate(d.applicable_date)} | {(props.forms[d.form_id] || {}).name }
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

DistributionSelector.propTypes = {
  value: PropTypes.number,

  /** Passes the entire distribution object */
  onChange: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(DistributionSelector)