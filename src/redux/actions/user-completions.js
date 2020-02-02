import { SET_USER_COMPLETIONS } from 'redux/action-list'

export const setUserCompletions = (userId, completionIds) => ({
  type: SET_USER_COMPLETIONS, userId, completionIds,
})