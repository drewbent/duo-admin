import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeedbackWidget from 'components/shared/widgets/feedback-widget'
import InfoWidget from 'components/shared/widgets/info-widget'
import LineItem from 'components/shared/line-item'
import Page from 'components/shared/page'
import { Paper, Toolbar, Typography, makeStyles } from '@material-ui/core'

import { fetchAllForms } from 'services/form-service'
import { fetchAllStudents } from 'services/class-student-service'
import { fetchClasses } from 'services/classes-service'
import { fetchDistribution } from 'services/distribution-service'
import { fetchResponsesForDistribution } from 'services/response-service'
import { flashError } from 'components/global-flash'
import { formatDate } from 'utils/date-utils'
import { getFeedbackForDistribution } from 'redux/reducers/responses'

const getDistributionId = props => parseInt(props.match.params.distributionId, 10)

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => {
  const distributionId = getDistributionId(ownProps)

  return {
    distribution: state.Distributions[distributionId],
    classes: state.Classes || {},
    forms: state.Forms || {},
    feedback: getFeedbackForDistribution(state, distributionId),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const distributionId = getDistributionId(ownProps)

  return {
    actions: {
      fetchDistribution: () => fetchDistribution(dispatch)(distributionId),
      fetchResponses: () => fetchResponsesForDistribution(dispatch)(distributionId),
      fetchAllForms: fetchAllForms(dispatch),
      fetchAllStudents: fetchAllStudents(dispatch),
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
      actions.fetchResponses(),
      actions.fetchClasses(),
      actions.fetchAllForms(),
      actions.fetchAllStudents(),
    ]).catch(flashError)
  }
  
  const distribution = props.distribution || {}

  return (
    <Page loading={ props.distribution == null }>
      <Paper className={ classes.section }>
        <InfoWidget 
          lineItems={ [
            { detail: formatDate(distribution.applicable_date), title: 'Date' },
            { detail: (props.classes[distribution.class_section_id] || {}).name, title: 'Class' },
            { detail: (props.forms[distribution.form_id] || {}).name, title: 'Form' },
          ] }
          title='Distribution Info'
        />
      </Paper>
      <Paper className={ classes.section }>
        <FeedbackWidget 
          feedback={ props.feedback }
          title='Distribution Feedback'
        />
      </Paper>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Distribution)