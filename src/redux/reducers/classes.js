import 'utils/array-utils'
import { ADD_CLASSES, DELETE_CLASS, SET_CLASSES } from 'redux/action-list'

/**
 * Mapping of id => class
 */
const initialState = {}

export default (state = initialState, action) => {
  const { classes, id } = action

  switch (action.type) {
    case ADD_CLASSES:
      console.log(`Redux: Adding ${classes.length} classes.`)
      return { ...state, ...classes.toObject('id') }
    case DELETE_CLASS:
      console.log(`Redux: Deleting class with id ${id}`)
      const newState = { ...state }
      delete newState[id]
      return newState
    case SET_CLASSES:
      console.log(`Redux: Setting ${classes.length} classes`)
      return classes.toObject('id')
    default:
      return state
  }
}