import 'utils/array-utils'
import * as api from 'utils/api'

import { addClassStudents, deleteClassStudent, setClassStudents } from 'redux/actions/class-students'
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
    dispatch(addClassStudents(classId, [student.id])),
  ])
}

/**
 * 
 * @param {Array<Object>} students An array of objects containing {email: string, name: string}
 */
export const createClassStudents = dispatch => async(classId, students) => {
  console.log(`Adding ${students.length} students to class ${classId}`)
  const { data: newStudents } = await api.post(`/classes/${classId}/students/create-multiple`, { students })
  return Promise.all([
    dispatch(addStudents(newStudents)),
    dispatch(addClassStudents(classId, newStudents.objValues('id'))),
  ])
}

export const deleteStudent = dispatch => async(classId, studentId) => {
  console.log(`Deleting student ${studentId} from class ${classId}`)
  await api.del(`/classes/${classId}/students/${studentId}`)
  return Promise.all([
    dispatch(deleteClassStudent(classId, studentId)),
    dispatch(deleteStudentRedux(studentId)),
  ])
}

export const updateStudent = dispatch => async(classId, studentId, data) => {
  console.log(`Updating student ${studentId}`)
  const { data: student } = await api.patch(`/classes/${classId}/students/${studentId}`, data)
  return dispatch(addStudents([student]))
}