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
 * order. The return payload is a list of responses with the format:
 * 
 * {
 *  studentId,
 *  createdAt,
 *  responses: response[]
 * }
 */
export const getFeedbackForSession = (state, sessionId, sortByTime = true) => {
  const groupedResponses = Object.values(state.Responses)
    .filter(r => r.session_id === sessionId)
    .reduce((acc, next) => {
      // Group responses by STUDENT and CREATION TIME
      const key = `${next.class_section_student_id}#${next.created_at}`
      if (acc[key] == null)
        acc[key] = []
      
      // Insert into sorted order
      let index = 0
      for (let i = 0; i < acc[key].length; i++) {
        if (acc[key][i].index_in_order > next.index_in_order)
          break
        else
          index += 1
      }

      acc[key].splice(index, 0, next)

      return acc
    }, {})

  let feedback = Object.keys(groupedResponses).map(key => {
    const responses = groupedResponses[key]
    return {
      studentId: responses[0].class_section_student_id,
      createdAt: responses[0].created_at,
      responses,
    }
  })

  if (sortByTime) {
    feedback = feedback.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
  }

  return feedback
}

