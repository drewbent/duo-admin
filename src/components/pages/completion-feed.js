import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'
import Page from 'components/shared/page'
import { Typography, makeStyles } from '@material-ui/core'

import { fetchAllStudents } from 'services/class-student-service'
import { fetchTodaysCompletions } from 'services/completions-service'
import { flashError } from 'components/global-flash'
import { getTodaysCompletions } from 'redux/reducers/completions'

import { sortDatesForObjects } from 'utils/date-utils'

const useStyles = makeStyles(theme => ({
  footerText: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
  row: {
    marginBottom: theme.spacing(2),
  },
}))

const mapStateToProps = state => ({
  completions: getTodaysCompletions(state)
    .filter(c => c.recorded_from === 'unit_view_task' || c.recorded_from === 'lesson_view_task')
    .sort(sortDatesForObjects('created_at', false)),
  students: state.Students,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchAllStudents: fetchAllStudents(dispatch),
    fetchTodaysCompletions: fetchTodaysCompletions(dispatch),
  },
})

function CompletionFeed(props) {
  const classes = useStyles()
  const { actions } = props
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  const fetchCompletions = () => actions.fetchTodaysCompletions().catch(flashError)

  useEffect(() => {
    fetchCompletions()
    const interval = setInterval(() => {
      fetchCompletions()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!hasFetchedData) {
    setHasFetchedData(true)
    Promise.all([
      actions.fetchAllStudents(),
    ]).catch(flashError)
  }
  
  const now = new Date()
  return (
    <Page>
      {props.completions.map(completion => (
        <div 
          className={ classes.row }
          key={ completion.id }
        >
          <MaterialTable 
            columns={ [
              { title: 'ID', field: 'id' },
              { title: 'Skill', field: 'skill' },
              { title: 'Student', render: row => (props.students[row.student_id] || {}).name },
              { title: '# Correct', field: 'questions_correct' },
              { title: '# Questions', field: 'questions_out_of' },
              { title: 'Recorded', render: row => 
                `${Math.floor(((now.getTime()) - Date.parse(row.created_at)) / 60000)} minutes ago`,
              },
            ] }
            data={ [completion] }
            key={ completion.id }
            options={ {
              toolbar: false,
              paging: false,
            } }
          />
        </div>
      ))}
      <Typography className={ classes.footerText }>
          Only completions from today, and collected from the lesson or unit view, are displayed.
      </Typography>
    </Page>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CompletionFeed)