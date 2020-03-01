import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CreateActiveMatchingAlgorithmDialog from 'components/shared/dialogs/create-active-matching-algorithm-dialog'
import CreateMatchingAlgorithmDialog from 'components/shared/dialogs/create-matching-algorithm-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { makeStyles } from '@material-ui/core'

import {
  activateMatchingAlgorithm,
  createMatchingAlgorithm, 
  fetchActiveMatchingAlgorithms,
  fetchAllMatchingAlgorithms,
} from 'services/matching-algorithm-service'
import { flashError, flashSuccess } from 'components/global-flash'
import { getCurrentlyActive } from 'redux/reducers/active-matching-algorithms'

const mapStateToProps = state => ({
  algorithms: state.MatchingAlgorithms,
  activeAlgorithms: getCurrentlyActive(state),
})

const mapDispatchToProps = dispatch => ({
  actions: {
    activateMatchingAlgorithm: activateMatchingAlgorithm(dispatch),
    createMatchingAlgorithm: createMatchingAlgorithm(dispatch),
    fetchActiveMatchingAlgorithms: fetchActiveMatchingAlgorithms(dispatch),
    fetchAllMatchingAlgorithms: fetchAllMatchingAlgorithms(dispatch),
  },
})

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}))

function Algorithms(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(true)
  const [createDialogLoading, setCreateDialogLoading] = useState(false)
  const [createActiveDialogOpen, setCreateActiveDialogOpen] = useState(false)
  const [createActiveDialogLoading, setCreateActiveDialogLoading] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchActiveMatchingAlgorithms(),
      actions.fetchAllMatchingAlgorithms(),
    ]).catch(flashError)
  }
  
  return (
    <Page>
      <CreateMatchingAlgorithmDialog 
        loading={ createDialogLoading }
        onClose={ () => setCreateDialogOpen(false) }
        onConfirm={ algorithm => {
          setCreateDialogLoading(true)
          actions.createMatchingAlgorithm(algorithm)
            .then(() => {
              setCreateDialogLoading(false)
              setCreateDialogOpen(false)
              flashSuccess('Algorithm created')
            })
            .catch(err => {
              setCreateDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createDialogOpen }
      />
      <CreateActiveMatchingAlgorithmDialog 
        loading={ createActiveDialogLoading }
        onClose={ () => setCreateActiveDialogOpen(false) }
        onConfirm={ data => {
          setCreateActiveDialogLoading(true)
          actions.activateMatchingAlgorithm(data)
            .then(() => {
              setCreateActiveDialogLoading(false)
              setCreateActiveDialogOpen(false)
              flashSuccess('Activated matching algorithm')
            })
            .catch(err => {
              setCreateActiveDialogLoading(false)
              flashError(err)
            })
        } }
        open={ createActiveDialogOpen }
        shouldFetchData={ false }
      />
      <div className={ classes.section }>
        <MaterialTable 
          actions={ [
            {
              tooltip: 'Set Active Matching Algorithm',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setCreateActiveDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'Key', field: 'key' },
            { title: 'Algorithm', render: row => (props.algorithms[row.matching_algorithm_id] || {}).name },
          ] }
          data={ props.activeAlgorithms }
          options={ {
            paging: false,
          } }
          title='Active Algorithms'
        />
      </div>
      <div className={ classes.section }>
        <MaterialTable
          actions={ [
            {
              tooltip: 'Create Matching Algorithm',
              icon: 'add_box',
              isFreeAction: true,
              onClick: () => setCreateDialogOpen(true),
            },
          ] }
          columns={ [
            { title: 'ID', field: 'id' },
            { title: 'Name', field: 'name' },
          ] }
          data={ Object.values(props.algorithms) }
          onRowClick={ (_, rowData) => props.history.push(`/algorithms/${rowData.id}`) }
          title='All Algorithms'
        />
      </div>
    </Page>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Algorithms))