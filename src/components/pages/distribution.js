import React, { useState } from 'react'
import { connect } from 'react-redux'

import LineItem from 'components/shared/line-item'
import Page from 'components/shared/page'
import { Paper, Toolbar, Typography, makeStyles } from '@material-ui/core'

import { fetchAllForms } from 'services/form-service'
import { fetchClasses } from 'services/classes-service'
import { fetchDistribution } from 'services/distribution-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { formatDate } from 'utils/date-utils'

const getDistributionId = props => parseInt(props.match.params.distributionId, 10)

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  infoContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    maxWidth: 500,
  },
}))

const mapStateToProps = (state, ownProps) => {
  const distributionId = getDistributionId(ownProps)

  return {
    distribution: state.Distributions[distributionId],
    classes: state.Classes || {},
    forms: state.Forms || {},
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const distributionId = getDistributionId(ownProps)

  return {
    actions: {
      fetchDistribution: () => fetchDistribution(dispatch)(distributionId),
      fetchAllForms: fetchAllForms(dispatch),
      fetchClasses: fetchClasses(dispatch),
    },
  }
}

function Distribution(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchDistribution(),
      actions.fetchClasses(),
      actions.fetchAllForms(),
    ]).catch(flashError)
  }
  
  const distribution = props.distribution || {}

  return (
    <Page loading={ props.distribution == null }>
      <Paper className={ classes.section }>
        <Toolbar>
          <Typography variant='h5'>
            Distribution Info
          </Typography>
        </Toolbar>
        <div className={ classes.infoContainer }>
          <LineItem 
            detail={ formatDate(distribution.applicable_date) }
            title='Date'
          />
          <LineItem 
            detail={ (props.classes[distribution.class_section_id] || {}).name }
            title='Class'
          />
          <LineItem 
            detail={ (props.forms[distribution.form_id] || {}).name }
            title='Form'
          />
        </div>
      </Paper>
      <Paper className={ classes.section }>
        <Toolbar className={ classes.toolbar }>
          <Typography variant='h6'>
            Distribution Feedback
          </Typography>
        </Toolbar>
      </Paper>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Distribution)