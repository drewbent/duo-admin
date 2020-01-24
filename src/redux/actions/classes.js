import { ADD_CLASSES, DELETE_CLASS, SET_CLASSES } from 'redux/action-list'

export const addClasses = classes => ({
  type: ADD_CLASSES,
  classes,
})

export const setClasses = classes => ({
  type: SET_CLASSES,
  classes,
})

export const deleteClass = id => ({
  type: DELETE_CLASS,
  id,
})