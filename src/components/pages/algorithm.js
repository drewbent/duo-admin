import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import CreateMatchingAlgorithmDialog from 'components/shared/dialogs/create-matching-algorithm-dialog'
import InfoWidget from 'components/shared/widgets/info-widget'
import Page from 'components/shared/page'
import ReactJson from 'react-json-view'
import SelectStudentDialog from 'components/shared/dialogs/select-student-dialog'
import { Button, Divider, Paper, TextField, Toolbar, Typography, makeStyles } from '@material-ui/core'

import {
  fetchMatchingAlgorithm,
  testMatchingAlgorithm,
  updateMatchingAlgorithm,
} from 'services/matching-algorithm-service'
import { flashError, flashSuccess } from 'components/global-flash'

import ArgumentType from 'models/argument-type'

const getAlgorithmId = props => parseInt(props.match.params.algorithmId, 10)

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  sectionContent: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  heading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  field: {
    marginBottom: theme.spacing(2),
    display: 'block',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  testOutput: {
    marginTop: theme.spacing(1),
  },
  bottomSpacing1: {
    marginBottom: theme.spacing(1),
  },
}))

const mapStateToProps = (state, ownProps) => {
  const algorithmId = getAlgorithmId(ownProps)

  return {
    algorithm: state.MatchingAlgorithms[algorithmId],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const algorithmId = getAlgorithmId(ownProps)

  return {
    actions: {
      fetchAlgorithm: () => fetchMatchingAlgorithm(dispatch)(algorithmId),
      updateAlgorithm: data => updateMatchingAlgorithm(dispatch)(algorithmId, data),
    },
  }
}

function Algorithm(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  const [isTesting, setIsTesting] = useState(true)
  const [selectStudentDialogOpen, setSelectStudentDialogOpen] = useState(false)
  const [testStudent, setTestStudent] = useState(null)
  /** Mapping of argName => { type, value } objects */
  const [testArguments, setTestArguments] = useState({})
  const [testAlgorithmPath, setTestAlgorithmPath] = useState('')
  /** Object with keys { path, error, output } */
  const [testOutput, setTestOutput] = useState(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [updateDialogLoading, setUpdateDialogLoading] = useState(false)

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAlgorithm(),
    ]).catch(flashError)
  }

  const algorithm = props.algorithm || {}
  const args = algorithm.args || []

  const getTestAlgorithmPath = () => {
    const student = testStudent || {}
    const paramString = Object.keys(testArguments).reduce((acc, next) => {
      acc.push(`${next}=${testArguments[next]}`)
      return acc
    }, []).join('&')
    return `/students/${student.id}/find-matches?algorithm_id=${algorithm.id}${paramString ? `&${paramString}` : ''}`
  }

  useEffect(() => {
    setTestAlgorithmPath(getTestAlgorithmPath())
  }, [testArguments, testStudent, props.algorithm])
  
  return (
    <Page loading={ props.algorithm == null }>
      <SelectStudentDialog 
        onClose={ () => setSelectStudentDialogOpen(false) }
        onSelect={ student => {
          setTestStudent(student)
          setSelectStudentDialogOpen(false)
        } }
        open={ selectStudentDialogOpen }
      />
      <CreateMatchingAlgorithmDialog 
        initialData={ algorithm }
        loading={ updateDialogLoading }
        onClose={ () => setUpdateDialogOpen(false) }
        onConfirm={ data => {
          if (Object.keys(data).length === 0)
            return setUpdateDialogOpen(false)

          setUpdateDialogLoading(true)
          actions.updateAlgorithm(data)
            .then(() => {
              setUpdateDialogLoading(false)
              setUpdateDialogOpen(false)
              flashSuccess('Algorithm Updated')
            })
            .catch(err => {
              setUpdateDialogLoading(false)
              flashError(err)
            })
        } }
        open={ updateDialogOpen }
      />
      <Paper className={ classes.section }>
        <InfoWidget
          actions={ [
            {
              tooltip: isTesting ? 'Stop Testing' : 'Test',
              icon: isTesting ? 'stop' : 'play_arrow',
              onClick: () => setIsTesting(!isTesting),
            },
            {
              tooltip: 'Edit Algorithm',
              icon: 'edit',
              onClick: () => setUpdateDialogOpen(true),
            },
          ] }
          title={ algorithm.name }
        >
          <Typography>
            {algorithm.description}
          </Typography>
          <Typography 
            className={ classes.heading }
            variant='h6'
          >
            Query
          </Typography>
          <Typography>{algorithm.sql_query}</Typography>
          <Typography
            className={ classes.heading }
            variant='h6'
          >
            Arguments
          </Typography>
          <Typography>{args.map(a => a.name ? a.name : a.field).join(', ') || 'No arguments'}</Typography>
        </InfoWidget>
      </Paper>
      {isTesting && <Paper className={ classes.section }>
        <Toolbar>
          <Typography variant='h6'>Test This Algorithm</Typography>
        </Toolbar>
        <div className={ classes.sectionContent }>
          <Typography className={ classes.field }>{testAlgorithmPath}</Typography>
          <Button 
            className={ classes.field }
            onClick={ () => setSelectStudentDialogOpen(true) }
            variant='outlined'
          >
            {testStudent ? testStudent.name : <em>No student selected</em>}
          </Button>
          {args.filter(arg => arg.type === ArgumentType.raw).map((arg, i) => {
            const value = testArguments[arg.field] || ''
            return (
              <TextField
                className={ classes.field }
                key={ i }
                label={ arg.name ? arg.name : arg.field }
                onChange={ e => { 
                  setTestArguments({ ...testArguments, [arg.field]: e.target.value }) 
                } }
                style={ { display: 'block' } }
                value={ value }
              />
            )
          })}
          <Button
            color='primary'
            onClick={ () => {
              testMatchingAlgorithm(testAlgorithmPath)
                .then(output => {
                  console.log(output)
                  setTestOutput({
                    path: testAlgorithmPath,
                    error: false,
                    output,
                  })
                })
                .catch(err => {
                  setTestOutput({
                    path: testAlgorithmPath,
                    error: true,
                    output: err.message,
                  })
                })
            } }
            style={ { color: 'white' } }
            variant='contained'
          >
            Test
          </Button>
          {testOutput != null && <div>
            <Divider
              className={ classes.divider }
              orientation='horizontal' 
            />
            <Typography className={ classes.bottomSpacing1 }>
              <strong>Path </strong>{testOutput.path}
            </Typography>
            <Typography className={ testOutput.error === false ? classes.bottomSpacing1 : '' }>
              <strong>Output </strong>{testOutput.error && testOutput.output}
            </Typography>
            {testOutput.error === false && <div className={ classes.testOutput }>
              <ReactJson src={ testOutput.output } /> 
            </div>}
          </div>}
        </div>
      </Paper>}
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Algorithm)