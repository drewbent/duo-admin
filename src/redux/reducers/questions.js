import 'utils/array-utils'
import { ADD_QUESTIONS } from '../action-list'

/** Mapping of questionId => question */
const initialState = {}

export default (state = initialState, action) => {
  const { questions } = action

  switch (action.type) {
    case ADD_QUESTIONS:
      console.log(`Adding ${questions.length} questions`)
      return { ...state, ...questions.toObject('id') }
    default:
      return state
  }
}