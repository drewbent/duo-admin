import { LOG_OUT, SET_LOGGED_IN, UPDATE_CURRENT_USER } from 'redux/action-list'

export const setLoggedIn = isLoggedIn => ({
  type: SET_LOGGED_IN,
  isLoggedIn,
})

export const updateUser = user => ({
  type: UPDATE_CURRENT_USER,
  user,
})

export const logout = () => ({
  type: LOG_OUT,
})