Array.prototype.toObject = function(key) {
  return this.reduce((acc, next) => {
    acc[next[key]] = next
    return acc
  }, {})
}