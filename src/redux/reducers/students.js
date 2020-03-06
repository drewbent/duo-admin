import 'utils/array-utils'
import { ADD_STUDENTS, DELETE_STUDENT } from 'redux/action-list'

// Initial state is a mapping of studentId => student
const initialState = {}

export default (state = initialState, action) => {
  const { students, id } = action

  switch (action.type) {
    case ADD_STUDENTS:
      console.log(`Redux: Adding ${students.length} students`)
      return { ...state, ...students.toObject('id') }
    case DELETE_STUDENT:
      console.log(`Redux: Deleting student with id ${id}`)
      const newState = { ...state }
      delete newState[id]
      return newState
    default:
      return state
  }
}

/**
 * Determine if the given student is in the given class
 * 
 * @param {Object} state Redux state
 * @param {Number} studentId Student ID
 * @param {Number} classId Class ID
 * @returns Bool; true if the student is in the class
 */
export const isStudentInClass = (state, studentId, classId) => {
  const student = state.Students[studentId] || {}
  return student.class_section_id === classId
}