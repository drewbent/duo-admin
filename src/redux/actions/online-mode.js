import { SET_ONLINE_MODE } from '../action-list'

export const setOnlineMode = isOnline => ({
  type: SET_ONLINE_MODE,
  isOnline,
})