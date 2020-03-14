import { SET_ONLINE_MODE } from '../action-list'

/** Whether or not we're online */
const initialState = false

export default (state = initialState, action) => {
  const { isOnline } = action
  
  switch (action.type) {
    case SET_ONLINE_MODE:
      console.log(`Redux: Setting online mode to ${isOnline}`)
      return isOnline
    default:
      return state
  }
}