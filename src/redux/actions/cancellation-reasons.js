import { SET_CANCELLATION_REASONS } from '../action-list'

export const setCancellationReasons = reasons => ({
  type: SET_CANCELLATION_REASONS,
  reasons,
})
