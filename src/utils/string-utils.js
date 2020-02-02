String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, (text) => {
    return text.capitalizedFirstLetter()
  })
}

String.prototype.capitalizedFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase()
}