import { HIDE_FLASH, SHOW_FLASH } from 'redux/action-list'

const DEFAULT_DURATION = 3500

export const flashSuccess = (message, duration = DEFAULT_DURATION) => {
  return flash('success', message, duration)
}

export const flashError = (message, duration = DEFAULT_DURATION) => {
  return flash('error', message, duration)
}

export const flash = (variant, message, duration) => ({
  type: SHOW_FLASH,
  variant,
  message,
  duration,
})

export const hideFlash = () => ({
  type: HIDE_FLASH,
})