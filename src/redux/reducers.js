import { combineReducers } from 'redux'

import ClassSessions from './reducers/class-sessions'
import ClassStudents from './reducers/class-students'
import Classes from './reducers/classes'
import Completions from './reducers/completions'
import CurrentUser from './reducers/current-user'
import GlobalFlash from './reducers/global-flash'
import Sessions from './reducers/sessions'
import Students from './reducers/students'
import UserCompletions from './reducers/user-completions'
import Users from './reducers/users'

const reducers = combineReducers({
  ClassSessions,
  ClassStudents,
  Classes,
  Completions,
  CurrentUser,
  GlobalFlash,
  Sessions,
  Students,
  UserCompletions,
  Users,
})

export default reducers