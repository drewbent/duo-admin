import * as ObjectUtils from 'utils/object-utils'
import expect from 'expect'

describe('Utils: Object Utils', () => {
  test('areEqual returns true when objects have same properties/values', () => {
    const a = {
      beep: 'boop',
      ping: 'pong',
    }

    const b = {
      beep: 'boop',
      ping: 'pong',
    }

    expect(ObjectUtils.areEqual(a, b)).toBe(true)
  })

  test('areEqual returns false when objects have different prop names', () => {
    const a = {
      beep: 'boop',
    }

    const b = {
      ping: 'pong',
    }

    expect(ObjectUtils.areEqual(a, b)).toBe(false)
  })

  test('areEqual returns false when objects have different prop values', () => {
    const a = {
      beep: 'boop',
    }

    const b = {
      beep: 'blart',
    }

    expect(ObjectUtils.areEqual(a, b)).toBe(false)
  })
})