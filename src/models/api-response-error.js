/**
 * An error object that represents an API error sent by the backend
 */
export default class extends Error {
  constructor({ message, status }, ...params) {
    super(...params)

    this.name = 'API Error'
    this.message = message
    this.status = status
  }
}