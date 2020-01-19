import { HIDE_FLASH, SHOW_FLASH } from 'redux/action-list'

const initialState = {
  variant: 'info',
  visible: false,
  message: 'Test flash message',
  duration: 4000,
}

export default (state = initialState, action) => {
  const { variant, message, duration } = action

  switch (action.type) {
    case SHOW_FLASH:
      return { variant, message, duration, visible: true }
    case HIDE_FLASH:
      return { ...state, visible: false }
    default:
      return state
  }
}