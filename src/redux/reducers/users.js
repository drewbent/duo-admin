import 'utils/array-utils'
import { ADD_USERS, SET_USERS } from 'redux/action-list'

/**
 * Mapping of userId => user
 */
const initialState = {}

export default (state = initialState, action) => {
  const { users } = action

  switch (action.type) {
    case ADD_USERS:
      console.log(`Redux: Adding ${users.length} users.`)
      return { ...state, ...users.toObject('id') }
    case SET_USERS:
      console.log(`Redux: Setting ${users.length} users.`)
      return users.toObject('id')
    default:
      return state
  }
}