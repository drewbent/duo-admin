import * as api from 'utils/api'

import { addClasses, deleteClass as deleteClassRedux, setClasses } from 'redux/actions/classes'

export const fetchClasses = dispatch => async() => {
  console.log('Fetching classes')
  const { data } = await api.get('/classes')
  dispatch(setClasses(data))
}

export const createClass = dispatch => async(data) => {
  if (!data.name)
    throw new Error('Must provide a name.')

  console.log('Creating new class')
  const { data: newClass } = await api.post('/classes', data)
  return dispatch(addClasses([newClass]))
}

export const updateClass = dispatch => async(id, name) => {
  if (!name)
    throw new Error('Must provide a name.')
  
  console.log(`Setting class ${id} name to ${name}`)
  const { data: newClass } = await api.patch(`/classes/${id}`, { name })
  return dispatch(addClasses([newClass]))
}

export const deleteClass = dispatch => async(id) => {
  console.log(`Deleting class with id ${id}`)
  await api.del(`/classes/${id}`, { id })
  return dispatch(deleteClassRedux(id))
}