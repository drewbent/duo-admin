import 'utils/array-utils'
import { ADD_SESSIONS } from '../action-list'

import { isStudentInClass } from 'redux/reducers/students'
import { isToday } from 'utils/date-utils'

/** Mapping of sessionId => session  */
const initialState = {}

export default (state = initialState, action) => {
  const { sessions } = action

  switch (action.type) {
    case ADD_SESSIONS:
      console.log(`Redux: Adding ${sessions.length} sessions`)
      return { ...state, ...sessions.toObject('id') }
    default:
      return state
  }
}

export const getTodaysSessions = state => {
  return Object.values(state.Sessions).filter(session => isToday(session.start_time))
}

export const getSessionsForClass = (state, classId) => {
  const isInClass = studentId => isStudentInClass(state, studentId, classId)

  return Object.values(state.Sessions).filter(session => 
    isInClass(session.learner_id) || isInClass(session.guide_id)
  )
}

/**
 * Selector for getting the sessions for a student.
 * 
 * @param {Object} state 
 * @param {*} studentId 
 * @param {String} role Accepts 'learner', 'guide', or anything else. If 'learner'
 * is passed it will only return sessions where the student was the learner; if 'guide',
 * the student was the guide; for anything else, it returns anything
 */
export const getSessionsForStudent = (state, studentId) => {
  return Object.values(state.Sessions).filter(session => (
    session.guide_id === studentId || session.learner_id === studentId
  ))
}

/**
 * Fetches the 'after' for a session
 */
export const getAfter = (state, sessionId) => {
  const beforeAfter = state.SessionBeforeAfter[sessionId]
  if (beforeAfter == null || beforeAfter.after == null)
    return null
  
  return state.Completions[beforeAfter.after]
}