import 'utils/array-utils'
import * as api from 'utils/api'

import { addCompletions } from 'redux/actions/completions'
import { setUserCompletions } from 'redux/actions/user-completions'

export const fetchCompletionsForUser = dispatch => async userId => {
  console.log(`Fetching completions for user ${userId}`)
  const { data } = await api.get(`/users/${userId}/ka-skill-completions`)
  return Promise.all([
    dispatch(addCompletions(data)),
    dispatch(setUserCompletions(userId, data.objValues('id'))),
  ])
}