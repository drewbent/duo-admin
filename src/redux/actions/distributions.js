import { ADD_DISTRIBUTIONS, DELETE_DISTRIBUTION } from '../action-list'

export const addDistributions = distributions => ({
  type: ADD_DISTRIBUTIONS,
  distributions,
})

export const deleteDistribution = distributionId => ({
  type: DELETE_DISTRIBUTION,
  distributionId,
})
