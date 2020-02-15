import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreateQuestionDialog from 'components/shared/dialogs/create-question-dialog'
import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import SelectQuestionDialog from 'components/shared/dialogs/select-question-dialog'

import { fetchForm } from 'services/form-service'
import { flashError, flashSuccess } from 'components/global-flash'

const getFormId = props => props.match.params.formId

const mapStateToProps = (state, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    form: state.Forms[formId],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const formId = getFormId(ownProps)

  return {
    actions: {
      fetchForm: () => fetchForm(dispatch)(formId),
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
      actions.fetchForm(),
    ]).catch(flashError)
  }

  if (form == null)
    return <Loader visible />
  
  return (
    <Page>
      <CreateQuestionDialog 
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ data => {

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
        title={ form.name }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)