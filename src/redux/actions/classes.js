import { ADD_CLASSES, SET_CLASSES } from 'redux/action-list'

export const addClasses = classes => ({
  type: ADD_CLASSES,
  classes,
})

export const setClasses = classes => ({
  type: SET_CLASSES,
  classes,
})