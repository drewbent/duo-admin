import { SET_USER_COMPLETIONS } from 'redux/action-list'

// Mapping of userId => completionId[]
const initialState = {}

export default (state = initialState, action) => {
  const { userId, completionIds } = action

  switch (action.type) {
    case SET_USER_COMPLETIONS:
      console.log(`Redux: Setting ${completionIds.length} completions for user ${userId}`)
      return { ...initialState, [userId]: completionIds }
    default:
      return state
  }
}