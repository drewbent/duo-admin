import { ADD_CLASS_STUDENTS, DELETE_CLASS_STUDENT, SET_CLASS_STUDENTS } from 'redux/action-list'

export const addClassStudents = (classId, studentIds) => ({
  type: ADD_CLASS_STUDENTS, 
  classId, studentIds,
})

export const setClassStudents = (classId, studentIds) => ({
  type: SET_CLASS_STUDENTS,
  classId, studentIds,
})

export const deleteClassStudent = (classId, studentId) => ({
  type: DELETE_CLASS_STUDENT,
  classId, studentId,
})
