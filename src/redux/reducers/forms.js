import 'utils/array-utils'
import { ADD_FORMS } from '../action-list'

/** Mapping of formId => form */
const initialState = {}

export default (state = initialState, action) => {
  const { forms } = action
  
  switch (action.type) {
    case ADD_FORMS:
      console.log(`Redux: Adding ${forms.length} forms`)
      return { ...state, ...forms.toObject('id') }
    default:
      return state
  }
}