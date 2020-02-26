import { SET_SKILLS_FOR_CLASS } from '../action-list'

/** Mapping of classId => skills[] */
const initialState = {}

export default (state = initialState, action) => {
  const { classId, skills } = action
  
  switch (action.type) {
    case SET_SKILLS_FOR_CLASS:
      console.log(`Setting ${skills.length} skills for class ${classId}`)
      return { ...state, [classId]: skills }
    default:
      return state
  }
}