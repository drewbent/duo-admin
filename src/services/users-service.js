import * as api from 'utils/api'

import { addUsers, setUsers } from 'redux/actions/users'

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

export const updateUser = dispatch => async(id, name) => {
  console.log(`Updating user with id ${id}`)
  const { data } = await api.patch(`/users/${id}`, { name })
  return dispatch(addUsers([data]))
}