import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreateQuestionDialog from 'components/shared/dialogs/create-question-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { makeStyles } from '@material-ui/core'

import { fetchAllQuestions } from 'services/question-service'
import { flashError } from 'components/global-flash'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = state => ({
  questions: state.Questions,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchQuestions: fetchAllQuestions(dispatch),
  },
})

function Forms(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchQuestions(),
    ]).catch(flashError)
  }

  return (
    <Page>
      <CreateQuestionDialog />
      <div className={ classes.section }>
        <MaterialTable 
          title='Forms'
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable 
          title='Questions'
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable 
          title='Distributions'
        />
      </div>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Forms)