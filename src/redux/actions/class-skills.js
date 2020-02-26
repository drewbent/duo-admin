import { SET_SKILLS_FOR_CLASS } from '../action-list'

export const setSkillsForClass = (classId, skills) => ({
  type: SET_SKILLS_FOR_CLASS,
  classId, skills,
})