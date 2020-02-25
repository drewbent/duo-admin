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

// SELECTORS
// =========

export const getFeedbackForSession = (state, sessionId) => {
  return getFeedback(state, 'session_id', sessionId)
}

export const getFeedbackForDistribution = (state, distributionId) => {
  return getFeedback(state, 'form_distribution_id', distributionId)
}

/**
 * Returns a feedback object, with all responses for the given "filterId," 
 * grouping by 'groupBy'. For example, to get "feedback for student 12", you 
 * would call `getFeedback(state, 'class_section_student_id', 12)`
 * 
 * @param {Object} state 
 * @param {String} field The response field to group reponses by (e.g.
 * form_distribution_id, class_section_student_id)
 * @param {Any} filterId The id to filter responses on
 * @param {Boolean} sortByTime Whether or not to sort the feedback by created_at 
 * time, ascending.
 */
const getFeedback = (state, groupBy, filterId, sortByTime = true) => {
  const groupedResponses = Object.values(state.Responses)
    .filter(r => r[groupBy] === filterId)
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