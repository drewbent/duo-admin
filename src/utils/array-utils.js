import { areEqual } from 'utils/object-utils'

Array.prototype.toObject = function(key) {
  return this.reduce((acc, next) => {
    acc[next[key]] = next
    return acc
  }, {})
}

Array.prototype.objValues = function(key) {
  return this.map(el => el[key])
}

export function areObjectElementsEqual(a, b) {
  if (a.length !== b.length)
    return false

  for (let i = 0; i < a.length; i++) {
    if (!areEqual(a[i], b[i])) return false
  }

  return true
}