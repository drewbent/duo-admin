import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CreateQuestionDialog from 'components/shared/dialogs/create-question-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'
import { AppBar, Box, Switch, Tab, Tabs, Typography, makeStyles } from '@material-ui/core'

import { archiveQuestion, createQuestion, fetchAllQuestions, updateQuestion } from 'services/question-service'
import { createForm, fetchAllForms } from 'services/form-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getOptionsDesc } from 'utils/question-utils'

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  tabs: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabText: {
    color: theme.palette.primary.main,
  },
}))

const mapStateToProps = state => ({
  forms: state.Forms,
  questions: state.Questions,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    archiveQuestion: archiveQuestion(dispatch),
    updateQuestion: updateQuestion(dispatch),
    createForm: createForm(dispatch),
    fetchForms: fetchAllForms(dispatch),
    createQuestion: createQuestion(dispatch),
    fetchQuestions: () => fetchAllQuestions(dispatch)(true),
  },
})

function tabProps(index) {
  return {
    'aria-controls': `tabpanel-${index},`,
    id: `tab-${index}`,
    style: {
      color: 'white',
    },
  }
}

function TabPanel(props) {
  return (
    <Typography
      aria-labelledby={ `tab-${props.index}` }
      component='div'
      hidden={ props.value !== props.index }
      id={ `tabpanel-${props.index}` }
      role='tabpanel'
    >
      <Box pt={ 2 }>
        {props.children}
      </Box>
    </Typography>
  )
}

function Forms(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [createFormDialogOpen, setCreateFormDialogOpen] = useState(false)
  const [createFormDialogLoading, setCreateFormDialogLoading] = useState(false)
  const [createQuestionDialogOpen, setCreateQuestionDialogOpen] = useState(false)
  const [createQuestionDialogLoading, setCreateQuestionDialogLoading] = useState(false)
  const [tab, setTab] = useState(0)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchQuestions(),
      actions.fetchForms(),
    ]).catch(flashError)
  }

  return (
    <Page>
      <CreateQuestionDialog 
        loading={ createQuestionDialogLoading }
        onClose={ () => setCreateQuestionDialogOpen(false) }
        onConfirm={ data => {
          setCreateQuestionDialogLoading(true)
          actions.createQuestion(data)
            .then(() => {
              setCreateQuestionDialogLoading(false)
              setCreateQuestionDialogOpen(false)
              flashSuccess('Question created')
            })
            .catch(err => {
              setCreateQuestionDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createQuestionDialogOpen }
      />
      <TextFieldDialog
        loading={ createFormDialogLoading }
        onClose={ () => setCreateFormDialogOpen(false) }
        onConfirm={ name => {
          setCreateFormDialogLoading(true)
          actions.createForm({ name })
            .then(form => {
              setCreateFormDialogOpen(false)
              setCreateFormDialogLoading(false)
              props.history.push(`/forms/${form.id}`)
              flashSuccess('Form created')
            })
            .catch(err => {
              setCreateFormDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createFormDialogOpen }
        textFieldProps={ {
          label: 'Name',
        } }
        title='Create Form'
      />
      <AppBar position='static'>
        <Tabs
          aria-label='form-tabs'
          classes={ {
            indicator: classes.indicator,
          } }
          className={ classes.tabs }
          onChange={ (_, newTab) => setTab(newTab) }
          value={ tab }
          variant='fullWidth'
        >
          <Tab 
            className={ classes.tab }
            label={ <span className={ classes.tabText }>Forms</span> }
            { ...tabProps(0) } 
          />
          <Tab
            label={ <span className={ classes.tabText }>Questions</span> }
            { ...tabProps(1) } 
          />
          <Tab 
            className={ classes.tab }
            label={ <span className={ classes.tabText }>Labels</span> }
            { ...tabProps(2) } 
          />
          <Tab 
            className={ classes.tab }
            label={ <span className={ classes.tabText }>Distributions</span> }
            { ...tabProps(3) } 
          />
        </Tabs>
      </AppBar>
      <TabPanel
        index={ 0 }
        value={ tab }
      >
        <MaterialTable 
          actions={ [
            {
              tooltip: 'Create Form',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setCreateFormDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Name', field: 'name' },
          ] }
          data={ Object.values(props.forms) }
          onRowClick={ (_, rowData) => props.history.push(`/forms/${rowData.id}`) }
          title='Forms'
        />
      </TabPanel>
      <TabPanel
        index={ 1 }
        value={ tab }
      >
        <MaterialTable
          actions={ [
            {
              tooltip: 'Create Question',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setCreateQuestionDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'ID', field: 'id', defaultSort: 'desc' },
            { title: 'Question', field: 'question' },
            { title: 'Question Type', field: 'question_type' },
            { title: 'Options', render: getOptionsDesc },
            { title: 'Responses', field: 'num_responses' },
            {
              title: 'Archived',
              render: rowData => (
                <Switch 
                  checked={ rowData.archived_at != null }
                  onChange={ e => {
                    actions.archiveQuestion(rowData.id, e.target.checked)
                      .catch(flashError)
                  } }
                />
              ),
            },
          ] }
          data={ Object.values(props.questions) }
          title='Questions'
        />
      </TabPanel>
      <TabPanel
        index={ 2 }
        value={ tab }
      >
        <MaterialTable 
          title='Labels'
        />
      </TabPanel>
      <TabPanel
        index={ 3 }
        value={ tab }
      >
        <MaterialTable 
          title='Distributions'
        />
      </TabPanel>
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forms))