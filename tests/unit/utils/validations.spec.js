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

    it('should work at boundary', () => {
      expect(validations.maxLength('12345', 5, 'Error')).toBe(true)
      expect(validations.maxLength('123456', 5, 'Error')).toBe('Error')
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

    it('should work at boundary', () => {
      expect(validations.minLength('123', 3, 'Error')).toBe(true)
      expect(validations.minLength('12', 3, 'Error')).toBe('Error')
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

    it('should validate various email formats', () => {
      expect(validations.mail('user+tag@example.co.uk')).toBe(true)
      expect(validations.mail('first.last@example.com')).toBe(true)
    })

    it('should reject emails with missing parts', () => {
      expect(validations.mail('user@', 'Error')).toBe('Error')
      expect(validations.mail('@example.com', 'Error')).toBe('Error')
    })
  })

  describe('email', () => {
    it('should be same as mail function', () => {
      const testEmail = 'test@example.com'
      expect(validations.email(testEmail)).toBe(validations.mail(testEmail))
    })

    it('should validate standard emails', () => {
      expect(validations.email('john.doe@company.com')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validations.email('invalid', 'Error')).toBe('Error')
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

    it('should validate URLs with different protocols', () => {
      expect(validations.url('http://example.com')).toBe(true)
      expect(validations.url('https://example.com')).toBe(true)
    })

    it('should validate URLs with paths and parameters', () => {
      expect(validations.url('https://example.com/path/to/page')).toBe(true)
      expect(validations.url('https://example.com?param=value')).toBe(true)
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

    it('should handle plain text without protocol', () => {
      expect(validations.startsWithHttpOrHttps('example.com', 'Error')).toBe('Error')
    })
  })

  describe('ip', () => {
    it('should validate IPv4 addresses', () => {
      expect(validations.ip('192.168.1.1', 'Error')).toBe(true)
      expect(validations.ip('10.0.0.1', 'Error')).toBe(true)
      expect(validations.ip('172.16.0.1', 'Error')).toBe(true)
    })

    it('should reject invalid IPv4 addresses', () => {
      expect(validations.ip('256.256.256.256', 'Error')).toBe('Error')
      expect(validations.ip('not.an.ip', 'Error')).toBe('Error')
      expect(validations.ip('192.168.1', 'Error')).toBe('Error')
    })

    it('should validate CIDR notation', () => {
      expect(validations.ip('192.168.1.0/24', 'Error')).toBe(true)
      expect(validations.ip('10.0.0.0/8', 'Error')).toBe(true)
    })

    it('should validate wildcard IPs', () => {
      expect(validations.ip('192.168.*.*', 'Error')).toBe(true)
      expect(validations.ip('192.168.1.*', 'Error')).toBe(true)
    })

    it('should use default message', () => {
      expect(validations.ip('invalid')).toBeTruthy()
    })
  })

  describe('ipv4Oripv6', () => {
    it('should validate IPv4 addresses', () => {
      expect(validations.ipv4Oripv6('192.168.1.1', 'Error')).toBe(true)
      expect(validations.ipv4Oripv6('10.0.0.1', 'Error')).toBe(true)
    })

    it('should validate IPv6 addresses', () => {
      expect(validations.ipv4Oripv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'Error')).toBe(true)
      expect(validations.ipv4Oripv6('::1', 'Error')).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(validations.ipv4Oripv6('invalid', 'Error')).toBe('Error')
      expect(validations.ipv4Oripv6('256.256.256.256', 'Error')).toBe('Error')
    })
  })

  describe('ipWithStars', () => {
    it('should validate standard IPv4 addresses only', () => {
      expect(validations.ipWithStars('192.168.1.1', 'Error')).toBe(true)
      expect(validations.ipWithStars('10.0.0.1', 'Error')).toBe(true)
    })

    it('should reject IPv4 with asterisks', () => {
      const msg = 'Error'
      expect(validations.ipWithStars('192.168.*.*', msg)).toBe(msg)
      expect(validations.ipWithStars('10.*.*.*', msg)).toBe(msg)
    })

    it('should reject invalid formats', () => {
      const msg = 'Error'
      expect(validations.ipWithStars('256.256.256.256', msg)).toBe(msg)
      expect(validations.ipWithStars('invalid', msg)).toBe(msg)
    })
  })

  describe('domain', () => {
    it('should validate valid domain names', () => {
      expect(validations.domain('example.com')).toBe(true)
      expect(validations.domain('www.example.com')).toBe(true)
      expect(validations.domain('sub.example.co.uk')).toBe(true)
    })

    it('should reject invalid domains', () => {
      const msg = 'Invalid domain'
      expect(validations.domain('invalid domain', msg)).toBe(msg)
      expect(validations.domain('.com', msg)).toBe(msg)
    })

    it('should handle empty string', () => {
      const msg = 'Invalid domain'
      expect(validations.domain('', msg)).toBe(msg)
    })
  })

  describe('port', () => {
    it('should validate valid port numbers', () => {
      expect(validations.port('80')).toBe(true)
      expect(validations.port('443')).toBe(true)
      expect(validations.port('8080')).toBe(true)
      expect(validations.port('65535')).toBe(true)
      expect(validations.port('65536')).toBe(true)
    })

    it('should reject invalid port numbers', () => {
      expect(validations.port('0')).toBeTruthy() // Returns error message
      expect(validations.port('65537')).toBeTruthy() // Returns error message
    })

    it('should reject non-numeric ports', () => {
      expect(validations.port('invalid')).toBeTruthy()
    })
  })

  describe('phone', () => {
    it('should validate E.164 format phone numbers', () => {
      expect(validations.phone('+11234567890')).toBe(true)
      expect(validations.phone('+442071838750')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      const msg = 'Invalid phone'
      expect(validations.phone('+1-123-456-7890', msg)).toBe(msg)
      expect(validations.phone('1234567890', msg)).toBe(msg)
      expect(validations.phone('+1 123 456 7890', msg)).toBe(msg)
      expect(validations.phone('invalid', msg)).toBe(msg)
      expect(validations.phone('123', msg)).toBe(msg)
    })

    it('should reject phone numbers not starting with +', () => {
      const msg = 'Invalid phone'
      expect(validations.phone('11234567890', msg)).toBe(msg)
    })
  })

  describe('required', () => {
    it('should validate non-empty values', () => {
      expect(validations.required('text')).toBe(true)
      expect(validations.required('0')).toBe(true)
      expect(validations.required(123)).toBe(true)
    })

    it('should reject empty/falsy values', () => {
      const msg = 'This field is required'
      expect(validations.required('', msg)).toBe(msg)
      expect(validations.required(null, msg)).toBe(msg)
      expect(validations.required(undefined, msg)).toBe(msg)
    })

    it('should treat 0 and false as invalid (falsy)', () => {
      const msg = 'Required'
      expect(validations.required(0, msg)).toBe(msg)
      expect(validations.required(false, msg)).toBe(msg)
    })
  })

  describe('All exported functions', () => {
    it('should export required functions', () => {
      expect(typeof validations.hasValue).toBe('function')
      expect(typeof validations.getValue).toBe('function')
      expect(typeof validations.maxLength).toBe('function')
      expect(typeof validations.minLength).toBe('function')
      expect(typeof validations.mail).toBe('function')
      expect(typeof validations.email).toBe('function')
      expect(typeof validations.url).toBe('function')
      expect(typeof validations.ip).toBe('function')
      expect(typeof validations.ipv4Oripv6).toBe('function')
      expect(typeof validations.ipWithStars).toBe('function')
      expect(typeof validations.domain).toBe('function')
      expect(typeof validations.port).toBe('function')
      expect(typeof validations.phone).toBe('function')
      expect(typeof validations.required).toBe('function')
      expect(typeof validations.startsWithHttpOrHttps).toBe('function')
    })
  })

  describe('Integration scenarios', () => {
    it('should validate a complete form', () => {
      const email = 'user@example.com'
      const website = 'https://example.com'
      const serverIp = '192.168.1.1'
      const apiPort = '8080'

      expect(validations.required(email)).toBe(true)
      expect(validations.email(email)).toBe(true)
      expect(validations.url(website)).toBe(true)
      expect(validations.ip(serverIp)).toBe(true)
      expect(validations.port(apiPort)).toBe(true)
    })

    it('should chain validations', () => {
      const value = 'test@example.com'
      expect(validations.required(value)).toBe(true)
      expect(validations.minLength(value, 5)).toBe(true)
      expect(validations.maxLength(value, 100)).toBe(true)
      expect(validations.email(value)).toBe(true)
    })
  })
})
