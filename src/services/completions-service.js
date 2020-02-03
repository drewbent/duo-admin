import 'utils/array-utils'
import * as api from 'utils/api'

import { addCompletions } from 'redux/actions/completions'
import { setUserCompletions } from 'redux/actions/user-completions'

export const fetchCompletionsForStudent = dispatch => async studentId => {
  console.log(`Fetching completions for user ${studentId}`)
  const { data } = await api.get(`/students/${studentId}/ka-skill-completions`)
  return Promise.all([
    dispatch(addCompletions(data)),
    dispatch(setUserCompletions(studentId, data.objValues('id'))),
  ])
}