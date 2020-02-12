import { ADD_CLASS_SESSIONS, SET_CLASS_SESSIONS } from '../action-list'

export const setClassSessions = (classId, sessionIds) => ({
    type: SET_CLASS_SESSIONS,
    classId, sessionIds,
})

export const addClassSessions = (classId, sessionIds) => ({
    type: ADD_CLASS_SESSIONS,
    classId, sessionIds
})