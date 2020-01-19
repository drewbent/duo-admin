import { LOG_OUT, SET_LOGGED_IN, UPDATE_CURRENT_USER } from 'redux/action-list'

const initialState = {
  isLoggedIn: false,
  user: {},
}

export default (state = initialState, action) => {
  const { user, isLoggedIn } = action

  switch (action.type) {
    case SET_LOGGED_IN:
      console.log(`Redux: Setting logged in state to ${isLoggedIn.toString()}`)
      return { ...state, isLoggedIn }
    case UPDATE_CURRENT_USER:
      console.log('Redux: Updating current user')
      return { ...state, user }
    case LOG_OUT:
      console.log('Redux: Logging out current user')  
      return { ...initialState }
    default:
      return state
  }
}