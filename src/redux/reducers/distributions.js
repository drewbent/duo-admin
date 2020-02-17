import 'utils/array-utils'
import { ADD_DISTRIBUTIONS, DELETE_DISTRIBUTION } from '../action-list'

/** Mapping of distributionId => distribution */
const initialState = {}

export default (state = initialState, action) => {
  const { distributions, distributionId } = action
  
  switch (action.type) {
    case ADD_DISTRIBUTIONS:
      console.log(`Redux: Adding ${distributions.length} distributions`)
      return { ...state, ...distributions.toObject('id') }   
    case DELETE_DISTRIBUTION:
      console.log(`Redux: Deleting distribution ${distributionId}`)
      const newState = { ...state }
      delete newState[distributionId]
      return newState
    default:
      return state
  }
}

export const getDistributionsForForm = (state, formId) => (
  Object.values(state.Distributions)
    .filter(d => d.form_id === formId)
)