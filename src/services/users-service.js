import * as api from 'utils/api'

import { addUsers, deleteUser as deleteUserRedux, setUsers } from 'redux/actions/users'

export const fetchUsers = dispatch => async() => {
  console.log('Fetching all users')
  const { data } = await api.get('/users')
  return dispatch(setUsers(data))
}

export const fetchUser = dispatch => async(id) => {
  console.log(`Fetching user with id ${id}`)
  const { data } = await api.get(`/users/${id}`)
  return dispatch(addUsers([data]))
}

export const updateUser = dispatch => async(id, data) => {
  console.log(`Updating user with id ${id}`)
  const { data: user } = await api.patch(`/users/${id}`, data)
  return dispatch(addUsers([user]))
}

export const deleteUser = dispatch => async(id) => {
  console.log(`Deleting user with id ${id}`)
  await api.del(`/users/${id}`)
  return dispatch(deleteUserRedux(id))
}