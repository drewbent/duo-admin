import 'utils/array-utils'
import { ADD_FORM_QUESTIONS } from '../action-list'

/** Mapping of formQuestionId => formQuestion */
const initialState = {}

export default (state = initialState, action) => {
  const { formQuestions } = action
  
  switch (action.type) {
    case ADD_FORM_QUESTIONS:
      console.log(`Redux: Adding ${formQuestions.length} form questions`)
      return { ...state, ...formQuestions.toObject('id') }
    default:
      return state
  }
}

export const getFormQuestionsForForm = (state, formId) => (
  Object.values(state.FormQuestions).filter(fq => fq.form_id === formId)
)