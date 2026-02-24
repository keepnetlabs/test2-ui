import labels from '@/model/constants/labels'

describe('model/constants/labels (extra coverage)', () => {
  describe('getMaxLengthMessage', () => {
    it('uses default val and length when not provided', () => {
      expect(labels.getMaxLengthMessage()).toBe(' cannot exceed 64 characters')
    })

    it('uses custom val and default length', () => {
      expect(labels.getMaxLengthMessage('Name')).toBe('Name cannot exceed 64 characters')
    })

    it('uses custom val and length', () => {
      expect(labels.getMaxLengthMessage('Email', 320)).toBe('Email cannot exceed 320 characters')
    })
  })

  describe('getMinLengthMessage', () => {
    it('uses default val and length when not provided', () => {
      expect(labels.getMinLengthMessage()).toBe(' must have at least 3 characters')
    })

    it('uses custom val and default length', () => {
      expect(labels.getMinLengthMessage('Password')).toBe('Password must have at least 3 characters')
    })

    it('uses custom val and length', () => {
      expect(labels.getMinLengthMessage('Code', 6)).toBe('Code must have at least 6 characters')
    })
  })

  describe('label constants', () => {
    it('has InvalidDomain', () => {
      expect(labels.InvalidDomain).toBe('Invalid domain')
    })

    it('has common UI labels', () => {
      expect(labels.Active).toBeDefined()
      expect(labels.Inactive).toBeDefined()
    })
  })
})
