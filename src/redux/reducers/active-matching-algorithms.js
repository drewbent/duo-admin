import 'utils/array-utils'
import { ADD_ACTIVE_MATCHING_ALGORITHMS } from '../action-list'

/** Mapping of recordId => record */
const initialState = {}

export default (state = initialState, action) => {
  const { actives } = action
  
  switch (action.type) {
    case ADD_ACTIVE_MATCHING_ALGORITHMS:
      console.log(`Redux: Adding ${actives.length} active matching algorithms.`)
      return { ...state, ...actives.toObject('id') }
    default:
      return state
  }
}

export function getCurrentlyActive(state) {
  return Object.values(state.ActiveMatchingAlgorithms).filter(a => a.archived_at === null)
}