import { combineReducers } from 'redux'

import ClassStudents from './reducers/class-students'
import Classes from './reducers/classes'
import CurrentUser from './reducers/current-user'
import GlobalFlash from './reducers/global-flash'
import Students from './reducers/students'
import Users from './reducers/users'

const reducers = combineReducers({
  ClassStudents,
  Classes,
  CurrentUser,
  GlobalFlash,
  Students,
  Users,
})

export default reducers