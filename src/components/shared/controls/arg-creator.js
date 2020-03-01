/**
 * @fileoverview For creating matching algorithm arguments
 */
import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'

import TooltipButton from 'components/shared/controls/tooltip-button'
import { 
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from '@material-ui/core'

const ARG_INPUT_TYPE = {
  field: 'Field',
  raw: 'Raw',
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  section: {
    display: 'flex',
  },
  argumentTypeSelect: {
    minWidth: 120,
    marginRight: theme.spacing(2),
  },
  nameField: {
    marginRight: theme.spacing(2),
  },
}))

function ArgCreator(props) {
  const classes = useStyles()

  const defaultArgType = ARG_INPUT_TYPE.field
  const value = Object.keys(props.value).length === 0 ? {
    name: '',
    type: defaultArgType,
    value: '',
  } : props.value

  const onChange = newData => {
    props.onChange({ ...value, ...newData })
  }

  return (
    <div className={ clsx(classes.container, props.className) }>
      <div className={ classes.section }>
        <TextField
          className={ classes.nameField }
          label='Name'
          onChange={ e => onChange({ name: e.target.value }) }
          value={ value.name }
        />
        <FormControl 
          className={ classes.argumentTypeSelect }
          required
        >
          <InputLabel>Type</InputLabel>
          <Select
            onChange={ e => onChange({ type: e.target.value }) }
            value={ value.type }
          >
            {Object.keys(ARG_INPUT_TYPE).map(key => (
              <MenuItem
                key={ key }
                value={ ARG_INPUT_TYPE[key] }
              >
                {ARG_INPUT_TYPE[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          error={ value.value === '' }
          label='Value'
          onChange={ e => onChange({ value: e.target.value }) }
          required
          value={ value.value }
        />
      </div>
      <div className={ classes.section }>
        {(props.actions || []).map((action, index) => (
          <TooltipButton 
            key={ index }
            { ...action }
          />
        ))}
      </div>
    </div>
  )
}

ArgCreator.propTypes = {
  /** Actions should contain props for tooltip buttons */
  actions: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  /**
   * The output is an object with keys { name, type, value }
   */
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
}

export default ArgCreator