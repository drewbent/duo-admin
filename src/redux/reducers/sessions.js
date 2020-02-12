import 'utils/array-utils'
import { ADD_SESSIONS } from '../action-list'

/** Mapping of sessionId => session  */
const initialState = {}

export default (state = initialState, action) => {
    const { sessions } = action

    switch (action.type) {
        case ADD_SESSIONS:
            console.log(`Redux: Adding ${sessions.length} sessions`)
            return { ...state, ...sessions.toObject('id') }
        default:
            return state
    }
}