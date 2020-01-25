import 'utils/array-utils'
import * as api from 'utils/api'

import { addClassStudent, deleteClassStudent, setClassStudents } from 'redux/actions/class-students'
import { addStudents, deleteStudent as deleteStudentRedux } from 'redux/actions/students'

export const fetchClassStudents = dispatch => async(classId) => {
  console.log(`Fetching students for class ${classId}`)
  const { data: students } = await api.get(`/classes/${classId}/students`)
  return Promise.all([
    dispatch(setClassStudents(classId, students.objValues('id'))),
    dispatch(addStudents(students)),
  ])
}

export const createClassStudent = dispatch => async(classId, email) => {
  console.log(`Adding ${email} to class ${classId}`)
  const { data: student } = await api.post(`/classes/${classId}/students`, { email })
  return Promise.all([
    dispatch(addStudents([student])),
    dispatch(addClassStudent(student.id)),
  ])
}

export const deleteStudent = dispatch => async(classId, studentId) => {
  console.log(`Deleting student ${studentId} from class ${classId}`)
  await api.del(`/classes/${classId}/students/${studentId}`)
  return Promise.all([
    dispatch(deleteClassStudent(studentId)),
    dispatch(deleteStudentRedux(studentId)),
  ])
}

export const updateStudent = dispatch => async(classId, studentId, email) => {
  console.log(`Updating student ${studentId} with email ${email}`)
  const { data: student } = await api.patch(`/classes/${classId}/students/${studentId}`, { email })
  return dispatch(addStudents([student]))
}