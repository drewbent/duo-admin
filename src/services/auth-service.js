import { logout as logoutRedux, setLoggedIn, updateUser } from 'redux/actions/current-user'

/**
 * This service serves as an abstraction layer for authentication
 */
const admins = ['philipshen13@gmail.com', 'drew3x@gmail.com']
const auth = firebase.auth()

function isAdmin(user) {
  if (user == null) return false
  return admins.includes(user.email)
}

export const fetchLoginStatus = dispatch => async() => {
  return new Promise((res) => {
    auth.onAuthStateChanged(user => {
      const isLoggedIn = user != null && isAdmin(user)
      dispatch(setLoggedIn(isLoggedIn))
      if (isLoggedIn) dispatch(updateUser(user))
      res()
    })
  })
}

export const login = dispatch => async(email, password) => {
  const { user } = await auth.signInWithEmailAndPassword(email, password)

  if (!isAdmin(user))
    throw new Error('Must be an admin.')

  return Promise.all([
    dispatch(setLoggedIn(true)),
    dispatch(updateUser(user)),
  ])
}

export const logout = dispatch => async() => {
  await auth.signOut()
  return dispatch(logoutRedux())
}