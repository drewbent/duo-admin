import * as api from 'utils/api'

import { setOnlineMode as setOnlineModeRedux } from 'redux/actions/online-mode'

export const fetchOnlineMode = dispatch => async() => {
  console.log('Fetching online mode')
  const { data } = await api.get('/online-mode')
  return dispatch(setOnlineModeRedux(data.is_online))
}

export const setOnlineMode = dispatch => async(online) => {
  console.log(`Setting online mode to ${online}`)
  await api.post('/online-mode', { is_online: online })
  return dispatch(setOnlineModeRedux(online))
}