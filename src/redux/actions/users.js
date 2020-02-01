import { ADD_USERS, DELETE_USER, SET_USERS } from 'redux/action-list'

export const addUsers = users => ({
  type: ADD_USERS, users,
})

export const setUsers = users => ({
  type: SET_USERS, users,
})

export const deleteUser = id => ({
  type: DELETE_USER, id,
})