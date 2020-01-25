import { ADD_STUDENTS, DELETE_STUDENT } from 'redux/action-list'

export const addStudents = students => ({
  type: ADD_STUDENTS,
  students,
})

export const deleteStudent = id => ({
  type: DELETE_STUDENT,
  id,
})