import { combineReducers } from 'redux'

import Classes from './reducers/classes'
import CurrentUser from './reducers/current-user'
import GlobalFlash from './reducers/global-flash'

const reducers = combineReducers({
  Classes,
  CurrentUser,
  GlobalFlash,
})

export default reducers