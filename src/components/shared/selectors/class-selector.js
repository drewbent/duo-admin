import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

import { fetchClasses } from 'services/classes-service'
import { flashError } from 'components/global-flash'

const mapStateToProps = state => ({
  classes: state.Classes,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchClasses: fetchClasses(dispatch),
  },
})

function ClassSelector(props) {
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchClasses(),
    ]).catch(flashError)
  }
  
  return (
    <FormControl fullWidth>
      <InputLabel id='class-selector-label'>Class</InputLabel>
      <Select
        onChange={ e => props.onChange(e.target.value) }
        value={ props.value }
      >
        <MenuItem value={ -1 }><em>None</em></MenuItem>
        {Object.values(props.classes).map(c => (
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

ClassSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassSelector)