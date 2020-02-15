import React, { useState } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/shared/loader'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'

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
      <MaterialTable
        actions={ [
          {
            tooltip: 'Add new question',
            icon: 'playlist_add',
            onClick: () => {},
          },
          {
            tooltip: 'Add existing question',
            icon: 'add_box',
            onClick: () => {},
          },
        ] }
        title={ form.name }
      />
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)