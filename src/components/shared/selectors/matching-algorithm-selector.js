import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

import { fetchAllMatchingAlgorithms } from 'services/matching-algorithm-service'
import { flashError } from 'components/global-flash'

const mapStateToProps = state => ({
  algorithms: state.MatchingAlgorithms,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAllMatchingAlgorithms: fetchAllMatchingAlgorithms(dispatch),
  },
})

function MatchingAlgorithmSelector(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(props.shouldFetchData === false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllMatchingAlgorithms(),
    ]).catch(flashError)
  }
  
  return (
    <FormControl fullWidth>
      <InputLabel>Matching Algorithm</InputLabel>
      <Select
        onChange={ e => props.onChange(e.target.value) }
        value={ props.value }
      >
        <MenuItem value={ -1 }><em>None</em></MenuItem>
        {Object.values(props.algorithms).map(a => (
          <MenuItem 
            key={ a.id }
            value={ a.id }
          >
            {a.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

MatchingAlgorithmSelector.propTypes = {
  // Value is an algorithm ID
  value: PropTypes.number,
  onChange: PropTypes.func,
  shouldFetchData: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchingAlgorithmSelector)