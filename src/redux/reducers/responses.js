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
      const studentId = next.class_section_student_id
      if (acc[studentId] == null)
        acc[studentId] = []
      
      // Insert into sorted order
      let index = 0
      for (let i = 0; i < acc[studentId].length; i++) {
        if (acc[studentId][i].index_in_order > next.index_in_order)
          break
        else
          index += 1
      }

      acc[studentId].splice(index, 0, next)

      return acc
    }, {})
)