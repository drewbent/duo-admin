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