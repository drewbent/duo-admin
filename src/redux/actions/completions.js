import { ADD_COMPLETIONS } from 'redux/action-list'

export const addCompletions = completions => ({
  type: ADD_COMPLETIONS, completions,
})