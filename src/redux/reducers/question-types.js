import { SET_QUESTION_TYPES } from '../action-list'

/** Just a list of question types */
const initialState = []

export default (state = initialState, action) => {
  const { types } = action

  switch (action.type) {
    case SET_QUESTION_TYPES:
      console.log(`Redux: Setting ${types.length} question types`)
      return types
    default:
      return state
  }
}