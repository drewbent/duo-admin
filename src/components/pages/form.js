import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreateQuestionDialog from 'components/shared/dialogs/create-question-dialog'
import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import SelectQuestionDialog from 'components/shared/dialogs/select-question-dialog'
import { Switch } from '@material-ui/core'

import { createQuestionForForm, fetchAllQuestions } from 'services/question-service'
import { fetchForm } from 'services/form-service'
import { fetchFormQuestionsForForm, updateFormQuestion } from 'services/form-question-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getFormQuestionsForForm } from 'redux/reducers/form-questions'
import { getOptionsDesc } from 'utils/question-utils'

const getFormId = props => parseInt(props.match.params.formId, 10)

const mapStateToProps = (state, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    form: state.Forms[formId],
    questions: getFormQuestionsForForm(state, formId)
      .map(fq => ({ formQuestion: fq, question: state.Questions[fq.question_id] })),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    actions: {
      createQuestion: data => createQuestionForForm(dispatch)(formId, data),
      fetchFormQuestions: () => fetchFormQuestionsForForm(dispatch)(formId),
      setFormQuestionRequired: (id, required) => updateFormQuestion(dispatch)(id, { required }),
      fetchForm: () => fetchForm(dispatch)(formId),
      fetchAllQuestions: fetchAllQuestions(dispatch),
    },
  }
}

function Form(props) {
  const { actions, form } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
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
    ]).catch(flashError)
  }

  if (form == null)
    return <Loader visible />

  console.log(props.questions)
  
  return (
    <Page>
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
        loading={ addDialogLoading }
        onClose={ () => setAddDialogOpen(false) }
        onSelect={ question => {
          
        } }
        open={ addDialogOpen }
      />
      <MaterialTable
        actions={ [
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
          { title: 'Question ID', field: 'question.id' },
          { title: 'Question', field: 'question.question' },
          { title: 'Options', render: rowData => getOptionsDesc(rowData.question) },
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
          },
        ] }
        data={ props.questions }
        title={ form.name }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)