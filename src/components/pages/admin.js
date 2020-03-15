import React, { useState } from 'react'
import { connect } from 'react-redux'

import Page from 'components/shared/page'
import { FormControlLabel, Paper, Switch, makeStyles } from '@material-ui/core'

import { fetchOnlineMode, setOnlineMode } from 'services/online-mode-service'
import { flashError, flashSuccess } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}))

const mapStateToProps = state => ({
  isOnline: state.OnlineMode,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchOnlineMode: fetchOnlineMode(dispatch),
    setOnlineMode: setOnlineMode(dispatch),
  },
})

function Admin(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchOnlineMode(),
    ]).catch(flashError)
  }
  
  return (
    <Page>
      <Paper className={ classes.paper }>
        <FormControlLabel 
          control={ 
            <Switch 
              checked={ props.isOnline } 
              onChange={ e => {
                actions.setOnlineMode(e.target.checked) 
                  .catch(flashError)
              } }
            /> 
          }
          label='Online Mode'
        />
      </Paper>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)