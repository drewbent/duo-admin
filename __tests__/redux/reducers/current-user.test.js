import * as actions from '../../../src/redux/action-list'
import expect from 'expect'
import reducer from '../../../src/redux/reducers/current-user'

describe('Reducer: CurrentUser', () => {
  it('Handles LOG_OUT', () => {
    const action = { type: actions.LOG_OUT }
    const initialState = {
      isLoggedIn: false,
      user: { example: 'Hello' },
    }

    const state = reducer(initialState, action)
    expect(state).toEqual({
      isLoggedIn: false,
      user: {},
    })
  })
})