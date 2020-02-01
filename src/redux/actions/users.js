import { ADD_USERS, SET_USERS } from 'redux/action-list'

export const addUsers = users => ({
  type: ADD_USERS, users,
})

export const setUsers = users => ({
  type: SET_USERS, users,
})