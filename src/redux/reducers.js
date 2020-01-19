import { combineReducers } from 'redux'

import CurrentUser from './reducers/current-user'
import GlobalFlash from './reducers/global-flash'

const reducers = combineReducers({
  CurrentUser,
  GlobalFlash,
})

export default reducers