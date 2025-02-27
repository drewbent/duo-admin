import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreateDistributionDialog from 'components/shared/dialogs/create-distribution-dialog'
import CreateQuestionDialog from 'components/shared/dialogs/create-question-dialog'
import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import SelectQuestionDialog from 'components/shared/dialogs/select-question-dialog'
import TextFieldDialog from 'components/shared/dialogs/text-field-dialog'
import { Switch, makeStyles } from '@material-ui/core'

import { createDistribution, fetchDistributionsForForm } from 'services/distribution-service'
import { createFormQuestion, fetchFormQuestionsForForm, updateFormQuestion, updateFormQuestionIndex } from 'services/form-question-service'
import { createQuestionForForm, fetchAllQuestions } from 'services/question-service'
import { fetchClasses } from 'services/classes-service'
import { fetchForm, updateForm } from 'services/form-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getDistributionsForForm } from 'redux/reducers/distributions'
import { getFormQuestionsForForm } from 'redux/reducers/form-questions'
import { getOptionsDesc } from 'utils/question-utils'

const getFormId = props => parseInt(props.match.params.formId, 10)

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = (state, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    form: state.Forms[formId],
    questions: getFormQuestionsForForm(state, formId)
      .map(fq => ({ formQuestion: fq, question: state.Questions[fq.question_id] })),
    distributions: getDistributionsForForm(state, formId),
    classes: state.Classes,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    actions: {
      fetchClasses: fetchClasses(dispatch),
      createDistribution: createDistribution(dispatch),
      fetchDistributions: () => fetchDistributionsForForm(dispatch)(formId),
      createQuestion: data => createQuestionForForm(dispatch)(formId, data),
      addQuestionToForm: question_id => createFormQuestion(dispatch)({ form_id: formId, question_id }),
      fetchFormQuestions: () => fetchFormQuestionsForForm(dispatch)(formId),
      setFormQuestionRequired: (id, required) => updateFormQuestion(dispatch)(id, { required }),
      archiveFormQuestion: id => updateFormQuestion(dispatch)(id, { archive: true }),
      fetchForm: () => fetchForm(dispatch)(formId),
      updateForm: data => updateForm(dispatch)(formId, data),
      updateFormQuestionIndex: updateFormQuestionIndex(dispatch),
      fetchAllQuestions: fetchAllQuestions(dispatch),
    },
  }
}

function Form(props) {
  const classes = useStyles()
  const { actions, form } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editDialogLoading, setEditDialogLoading] = useState(false)
  const [createDistDialogOpen, setCreateDistDialogOpen] = useState(false)
  const [createDistDialogLoading, setCreateDistDialogLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogLoading, setCreateDialogLoading] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addDialogLoading, setAddDialogLoading] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllQuestions(),
      actions.fetchFormQuestions(),
      actions.fetchForm(),
      actions.fetchDistributions(),
      actions.fetchClasses(),
    ]).catch(flashError)
  }

  if (form == null)
    return <Loader visible />
  
  return (
    <Page>
      <TextFieldDialog
        initialValue={ form.name }
        loading={ editDialogLoading }
        onClose={ () => setEditDialogOpen(false) }
        onConfirm={ name => {
          setEditDialogLoading(true)
          actions.updateForm({ name })
            .then(() => {
              setEditDialogLoading(false)
              setEditDialogOpen(false)
              flashSuccess('Form updated')
            })
            .catch(err => {
              setEditDialogLoading(false)
              flashError(err)
            })
        } }
        open={ editDialogOpen }
        textFieldProps={ {
          label: 'Name',
        } }
        title='Edit Form'
      />
      <CreateDistributionDialog 
        initialData={ { form_id: getFormId(props) } }
        loading={ createDistDialogLoading }
        onClose={ () => setCreateDistDialogOpen(false) }
        onConfirm={ data => {
          setCreateDistDialogLoading(true)
          actions.createDistribution(data)
            .then(() => {
              setCreateDistDialogLoading(false)
              setCreateDistDialogOpen(false)
              flashSuccess('Distribution Created')
            })
            .catch(err => {
              setCreateDistDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createDistDialogOpen }
      />
      <CreateQuestionDialog 
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ data => {
          setCreateDialogLoading(true)
          actions.createQuestion(data)
            .then(() => {
              setCreateDialogLoading(false)
              setCreateDialogOpen(false)
              flashSuccess('Question created')
            })
            .catch(err => {
              setCreateDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createDialogOpen }
      />
      <SelectQuestionDialog
        blacklist={ props.questions
          .map(data => data.question ? data.question.id : null) 
          .filter(x => x)
        }
        loading={ addDialogLoading }
        onClose={ () => setAddDialogOpen(false) }
        onSelect={ question => {
          setAddDialogLoading(true)
          actions.addQuestionToForm(question.id)
            .then(() => {
              setAddDialogLoading(false)
              setAddDialogOpen(false)
              flashSuccess('Added question to form')
            })
            .catch(err => {
              setAddDialogLoading(false)
              flashError(err)
            })
        } }
        open={ addDialogOpen }
        title='Add Question'
      />
      <div className={ classes.section }>
        <MaterialTable
          actions={ [
            {
              tooltip: 'Edit Form Info',
              icon: 'edit',
              isFreeAction: true,
              onClick: () => setEditDialogOpen(true),
            },
            {
              tooltip: 'Add existing question',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setAddDialogOpen(true),
            },
            {
              tooltip: 'Add new question',
              icon: 'playlist_add',
              isFreeAction: true,
              onClick: () => setCreateDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'Index', field: 'formQuestion.index_in_form', defaultSort: 'asc' },
            { title: 'Question', field: 'question.question', editable: false },
            { title: 'Options', render: rowData => getOptionsDesc(rowData.question), editable: false },
            {
              title: 'Required?',
              render: rowData => (
                <Switch 
                  checked={ rowData.formQuestion.required } 
                  onChange={ e => {
                    actions.setFormQuestionRequired(rowData.formQuestion.id, e.target.checked)
                      .catch(flashError)
                  } }
                />
              ),
              editable: false,
            },
          ] }
          data={ props.questions }
          editable={ {
            onRowUpdate: async rowData => {
              const index = parseInt(rowData.formQuestion.index_in_form, 10)
              if (isNaN(index))
                return flashError('Index must be a number')
              
              return actions.updateFormQuestionIndex(rowData.formQuestion.id, index)
                .then(() => flashSuccess('Index updated'))
                .catch(flashError)
            },
            onRowDelete: async rowData => {
              return actions.archiveFormQuestion(rowData.formQuestion.id)
                .then(() => flashSuccess('Question archived'))
                .catch(flashError)
            },
          } }
          options={ {
            actionsColumnIndex: 4,
            paging: false,
          } }
          title={ form.name }
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable
          actions={ [
            {
              tooltip: 'Create Distribution',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setCreateDistDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Class', render: rowData => (props.classes[rowData.class_section_id] || {}).name },
            { title: 'Date', field: 'applicable_date', defaultSort: 'desc' },
            { title: '# Responses', field: 'num_responses' },
          ] }
          data={ props.distributions }
          title='Distributions'
        />
      </div>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)