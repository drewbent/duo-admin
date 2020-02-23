import { SET_CANCELLATION_REASONS } from '../action-list'

/** A list of cancellation reason objects */
const initialState = []

export default (state = initialState, action) => {
  const { reasons } = action
  
  switch (action.type) {
    case SET_CANCELLATION_REASONS:
      console.log(`Setting ${reasons.length} cancellation reasons`)
      return [ ...reasons ]
    default:
      return state
  }
}