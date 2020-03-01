import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { TextField, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  scaleContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  scaleDivider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}))

function LinearScaleCreator(props) {
  const classes = useStyles()
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(10)
  const [minLabel, setMinLabel] = useState('')
  const [maxLabel, setMaxLabel] = useState('')

  useEffect(() => {
    props.onChange({
      min: {
        value: min,
        label: minLabel,
      },
      max: {
        value: max,
        label: maxLabel,
      },
    })
  }, [min, max, minLabel, maxLabel])

  return (
    <div className={ classes.container }>
      <div className={ classes.scaleContainer }>
        <TextField 
          label='Min'
          onChange={ e => setMin(parseInt(e.target.value, 10)) }
          type='number'
          value={ min } 
        />
        <Typography className={ classes.scaleDivider }>to</Typography>
        <TextField 
          label='Max'
          onChange={ e => setMax(parseInt(e.target.value, 10)) }
          type='Number'
          value={ max }
        />
      </div>
      <TextField
        className={ classes.input }
        fullWidth
        label='Min Label (optional)'
        onChange={ e => setMinLabel(e.target.value) }
        value={ minLabel }
      />
      <TextField
        className={ classes.input }
        fullWidth
        label='Max Label (optional)'
        onChange={ e => setMaxLabel(e.target.value) }
        value={ maxLabel }
      />
    </div>
  )
}

LinearScaleCreator.propTypes = {
  /**
   * Will be passed an object formatted { min: { value, label }, max: { value, label } }
   */
  onChange: PropTypes.func,
}

export default LinearScaleCreator