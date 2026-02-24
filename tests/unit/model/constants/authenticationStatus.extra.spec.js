import AuthenticationStatus from '@/model/constants/authenticationStatus'

describe('model/constants/authenticationStatus (extra)', () => {
  it('has stable uppercase values equal to their keys', () => {
    Object.entries(AuthenticationStatus).forEach(([key, value]) => {
      expect(value).toBe(key)
      expect(value).toBe(value.toUpperCase())
    })
  })

  it('contains exactly four authentication states', () => {
    expect(Object.keys(AuthenticationStatus)).toEqual([
      'EXPIRED',
      'UNAUTHENTICATED',
      'AUTHENTICATED',
      'REQUIRETWOSTEP'
    ])
  })

  it('status values are unique and non-empty', () => {
    const values = Object.values(AuthenticationStatus)
    expect(values.every((v) => typeof v === 'string' && v.length > 0)).toBe(true)
    expect(new Set(values).size).toBe(values.length)
  })

  it('does not include whitespace in status values', () => {
    Object.values(AuthenticationStatus).forEach((value) => {
      expect(value.includes(' ')).toBe(false)
    })
  })
})
