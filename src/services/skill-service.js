import * as api from 'utils/api'

import { setSkillsForClass } from 'redux/actions/class-skills'

export const fetchSkillsForClass = dispatch => async(classId) => {
  console.log(`Fetching skills for class ${classId}`)
  const { data } = await api.get(`/classes/${classId}/skills`)
  return dispatch(setSkillsForClass(classId, data))
}