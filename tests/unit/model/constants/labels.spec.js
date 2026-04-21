import labels from '@/model/constants/labels'

describe('model/constants/labels', () => {
  it('builds max length validation message', () => {
    expect(labels.getMaxLengthMessage('Email', 100)).toBe('Email cannot exceed 100 characters')
  })

  it('builds min length validation message', () => {
    expect(labels.getMinLengthMessage('Password', 8)).toBe('Password must have at least 8 characters')
  })

  it('contains core label keys used across UI', () => {
    expect(labels.Email).toBe('Email Address')
    expect(labels.CreatedBy).toBe('Created By')
    expect(labels.Type).toBe('Type')
    expect(labels.TryAgain).toBe('Try Again')
  })

  it('exposes IpRestricted fallback for backend IP restriction (403 IP_RESTRICTED) error UI', () => {
    expect(typeof labels.IpRestricted).toBe('string')
    expect(labels.IpRestricted.length).toBeGreaterThan(0)
    expect(labels.IpRestricted.toLowerCase()).toContain('network')
    expect(labels.IpRestricted.toLowerCase()).toContain('administrator')
  })
})
