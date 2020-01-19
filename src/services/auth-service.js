/**
 * This service serves as an abstraction layer for authentication
 */
const admins = ['philipshen13@gmail.com', 'drew3x@gmail.com']
const auth = firebase.auth()

export const isLoggedIn = () => {
  return new Promise(res =>
    auth.onAuthStateChanged(user => 
      res(user != null && admins.includes(user.email))
    )
  )
}

export const login = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}