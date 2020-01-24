import * as api from 'utils/api'

import { addClasses, setClasses } from 'redux/actions/classes'

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