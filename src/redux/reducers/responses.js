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

/**
 * Gets the responses for a session, grouped by student, sorted in their original sort 
 * order. The return payload is a mapping of: studentId => response[]
 */
export const getResponsesForSession = (state, sessionId) => (
  Object.values(state.Responses)
    .filter(r => r.session_id === sessionId)
    .reduce((acc, next) => {
      if (acc[next.student_id] == null)
        acc[next.student_id] = []
      
      // Insert into sorted order
      let index = 0
      for (let i = 0; i < acc[next.student_id].length; i++) {
        if (acc[next.student_id][i].index_in_order > next.index_in_order)
          break
        else
          index += 1
      }

      acc[next.student_id].splice(index, 0, next)

      return acc
    }, {})
)