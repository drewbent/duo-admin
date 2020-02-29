import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CreateMatchingAlgorithmDialog from 'components/shared/dialogs/create-matching-algorithm-dialog'
import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { makeStyles } from '@material-ui/core'

import { createMatchingAlgorithm, fetchAllMatchingAlgorithms } from 'services/matching-algorithm-service'
import { flashError, flashSuccess } from 'components/global-flash'

const mapStateToProps = state => ({
  algorithms: state.MatchingAlgorithms,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    createMatchingAlgorithm: createMatchingAlgorithm(dispatch),
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogLoading, setCreateDialogLoading] = useState(false)
  
  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
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
      <div className={ classes.section }>
        <MaterialTable 
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