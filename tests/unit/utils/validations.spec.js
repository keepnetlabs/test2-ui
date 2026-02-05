import * as validations from '@/utils/validations'

describe('Validations Utility', () => {
  describe('hasValue', () => {
    it('should return value if truthy', () => {
      expect(validations.hasValue('test')).toBe('test')
      expect(validations.hasValue(123)).toBe(123)
      expect(validations.hasValue(true)).toBe(true)
    })

    it('should return undefined if falsy', () => {
      expect(validations.hasValue('')).toBeUndefined()
      expect(validations.hasValue(0)).toBeUndefined()
      expect(validations.hasValue(false)).toBeUndefined()
      expect(validations.hasValue(null)).toBeUndefined()
    })
  })

  describe('getValue', () => {
    it('should return value if not null or undefined', () => {
      expect(validations.getValue('test')).toBe('test')
      expect(validations.getValue(0)).toBe(0)
      expect(validations.getValue(false)).toBe(false)
      expect(validations.getValue('')).toBe('')
    })

    it('should return empty string if null or undefined', () => {
      expect(validations.getValue(null)).toBe('')
      expect(validations.getValue(undefined)).toBe('')
    })
  })

  describe('maxLength', () => {
    it('should return true if value length <= max length', () => {
      expect(validations.maxLength('test', 5, 'Too long')).toBe(true)
      expect(validations.maxLength('test', 4, 'Too long')).toBe(true)
    })

    it('should return message if value length > max length', () => {
      expect(validations.maxLength('test', 3, 'Too long')).toBe('Too long')
      expect(validations.maxLength('toolong', 3, 'Error')).toBe('Error')
    })

    it('should handle null/undefined values', () => {
      expect(validations.maxLength(null, 5, 'Error')).toBe(true)
      expect(validations.maxLength(undefined, 5, 'Error')).toBe(true)
    })
  })

  describe('minLength', () => {
    it('should return true if value length >= min length', () => {
      expect(validations.minLength('test', 3, 'Too short')).toBe(true)
      expect(validations.minLength('test', 4, 'Too short')).toBe(true)
    })

    it('should return message if value length < min length', () => {
      expect(validations.minLength('ab', 3, 'Too short')).toBe('Too short')
      expect(validations.minLength('x', 2, 'Error')).toBe('Error')
    })
  })

  describe('mail', () => {
    it('should validate email addresses', () => {
      const validEmail = 'test@example.com'
      const result = validations.mail(validEmail, 'Invalid email')
      expect(result).toBe(true)
    })

    it('should reject invalid emails', () => {
      const invalidEmail = 'notanemail'
      const result = validations.mail(invalidEmail, 'Invalid email')
      expect(result).toBe('Invalid email')
    })
  })

  describe('url', () => {
    it('should validate URLs', () => {
      const validUrl = 'https://example.com'
      const result = validations.url(validUrl, 'Invalid URL')
      expect(result).toBe(true)
    })

    it('should return message for invalid URLs', () => {
      const invalidUrl = 'not a url'
      const result = validations.url(invalidUrl, 'Invalid URL')
      expect(result).toBe('Invalid URL')
    })

    it('should return true for empty strings', () => {
      expect(validations.url('', 'Error')).toBe(true)
    })

    it('should reject URLs with spaces', () => {
      expect(validations.url('http://exam ple.com', 'Error')).toBe('Error')
    })
  })

  describe('startsWithHttpOrHttps', () => {
    it('should validate URLs starting with http://', () => {
      expect(validations.startsWithHttpOrHttps('http://example.com', 'Error')).toBe(true)
    })

    it('should validate URLs starting with https://', () => {
      expect(validations.startsWithHttpOrHttps('https://example.com', 'Error')).toBe(true)
    })

    it('should reject URLs not starting with http/https', () => {
      const result = validations.startsWithHttpOrHttps('ftp://example.com', 'Error')
      expect(result).toBe('Error')
    })

    it('should reject URLs with spaces', () => {
      expect(validations.startsWithHttpOrHttps('http://exam ple.com', 'Error')).toBe('Error')
    })
  })

  describe('ip', () => {
    it('should validate IPv4 addresses', () => {
      expect(validations.ip('192.168.1.1', 'Error')).toBe(true)
      expect(validations.ip('10.0.0.1', 'Error')).toBe(true)
    })

    it('should reject invalid IPv4 addresses', () => {
      expect(validations.ip('256.256.256.256', 'Error')).toBe('Error')
      expect(validations.ip('not.an.ip', 'Error')).toBe('Error')
    })
  })

  describe('All exported functions', () => {
    it('should export required functions', () => {
      expect(typeof validations.hasValue).toBe('function')
      expect(typeof validations.getValue).toBe('function')
      expect(typeof validations.maxLength).toBe('function')
      expect(typeof validations.minLength).toBe('function')
      expect(typeof validations.mail).toBe('function')
      expect(typeof validations.url).toBe('function')
      expect(typeof validations.ip).toBe('function')
      expect(typeof validations.startsWithHttpOrHttps).toBe('function')
    })
  })
})
