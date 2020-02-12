import 'utils/array-utils'
import * as api from 'utils/api'

import { addSessions } from 'redux/actions/sessions'
import { setClassSessions } from 'redux/actions/class-sessions'

export const fetchSessionsForClass = dispatch => async classId => {
    console.log(`Fetching sessions for class ${classId}`)
    const { data } = await api.get(`/classes/${classId}/tutoring-sessions`)
    return Promise.all([
        dispatch(addSessions(data)),
        dispatch(setClassSessions(classId, data.objValues('id')))
    ])
}