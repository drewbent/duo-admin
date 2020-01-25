import { ADD_CLASS_STUDENTS, DELETE_CLASS_STUDENT, SET_CLASS_STUDENTS } from 'redux/action-list'

/**
 * Mapping of classId => studentId[]
 */
const initialState = {}

export default (state = initialState, action) => {
  const { classId, studentId, studentIds } = action

  switch (action.type) {
    case ADD_CLASS_STUDENTS:
      console.log(`Redux: Adding student ${studentIds} to class ${classId}`)
      console.log(studentIds)
      return { ...state, [classId]: [ ...(state[classId] || []), ...studentIds ] }
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