import { combineReducers } from 'redux'

import ClassStudents from './reducers/class-students'
import Classes from './reducers/classes'
import Completions from './reducers/completions'
import CurrentUser from './reducers/current-user'
import GlobalFlash from './reducers/global-flash'
import Students from './reducers/students'
import UserCompletions from './reducers/user-completions'
import Users from './reducers/users'

const reducers = combineReducers({
  ClassStudents,
  Classes,
  Completions,
  CurrentUser,
  GlobalFlash,
  Students,
  UserCompletions,
  Users,
})

export default reducers