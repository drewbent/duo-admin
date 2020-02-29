import 'utils/array-utils'
import { ADD_MATCHING_ALGORITHMS } from '../action-list'

/** Mapping of algorithmId => algorithm */
const initialState = {}

export default (state = initialState, action) => {
  const { algorithms } = action
  
  switch (action.type) {
    case ADD_MATCHING_ALGORITHMS:
      console.log(`Redux: Adding ${algorithms.length} matching algorithms`)
      return { ...state, ...algorithms.toObject('id') }
    default:
      return state
  }
}