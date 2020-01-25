import { ADD_CLASS_STUDENT, DELETE_CLASS_STUDENT, SET_CLASS_STUDENTS } from 'redux/action-list'

/**
 * Mapping of classId => studentId[]
 */
const initialState = {}

export default (state = initialState, action) => {
  const { classId, studentId, studentIds } = action

  switch (action.type) {
    case ADD_CLASS_STUDENT:
      console.log(`Redux: Adding student ${studentId} to class ${classId}`)
      return { ...state, [classId]: [ ...(state[classId] || []), studentId ] }
    case DELETE_CLASS_STUDENT:
      console.log(`Redux: Deleting student ${studentId} from class ${classId}`)
      return { ...state, [classId]: (state[classId] || []).filter(s => s != studentId) }
    case SET_CLASS_STUDENTS:
      console.log(`Redux: Setting ${studentIds.length} students to class ${classId}`)
      return { ...state, [classId]: studentIds }
    default:
      return state
  }
}