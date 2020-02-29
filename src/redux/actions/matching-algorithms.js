import { ADD_MATCHING_ALGORITHMS } from '../action-list'

export const addMatchingAlgorithms  = algorithms => ({
  type: ADD_MATCHING_ALGORITHMS,
  algorithms,
})