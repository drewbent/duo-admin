import 'utils/array-utils'
import { ADD_RESPONSES } from '../action-list'

/** Mapping of responseId => response */
const initialState = {}

export default (state = initialState, action) => {
  const { responses } = action
  
  switch (action.type) {
    case ADD_RESPONSES:
      console.log(`Redux: Adding ${responses.length} responses`)
      return { ...state, ...responses.toObject('id') }
    default:
      return state
  }
}