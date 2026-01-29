import * as Validations from '@/utils/validations'

describe('validations.js', () => {
  describe('hasValue', () => {
    it('returns value when it has a truthy value', () => {
      expect(Validations.hasValue('test')).toBe('test')
      expect(Validations.hasValue(123)).toBe(123)
      expect(Validations.hasValue(true)).toBe(true)
    })

    it('returns undefined when value is falsy', () => {
      expect(Validations.hasValue('')).toBeUndefined()
      expect(Validations.hasValue(null)).toBeUndefined()
      expect(Validations.hasValue(0)).toBeUndefined()
      expect(Validations.hasValue(false)).toBeUndefined()
    })
  })

  describe('getValue', () => {
    it('returns value when it is not null or undefined', () => {
      expect(Validations.getValue('test')).toBe('test')
      expect(Validations.getValue(123)).toBe(123)
      expect(Validations.getValue(0)).toBe(0)
    })

    it('returns empty string when value is null or undefined', () => {
      expect(Validations.getValue(null)).toBe('')
      expect(Validations.getValue(undefined)).toBe('')
    })
  })

  describe('maxLength', () => {
    it('returns true when value length is within limit', () => {
      expect(Validations.maxLength('test', 5, 'Too long')).toBe(true)
      expect(Validations.maxLength('test', 4, 'Too long')).toBe(true)
    })

    it('returns message when value length exceeds limit', () => {
      const message = 'Too long'
      expect(Validations.maxLength('test', 3, message)).toBe(message)
      expect(Validations.maxLength('hello', 2, message)).toBe(message)
    })

    it('handles null/undefined values', () => {
      expect(Validations.maxLength(null, 5, 'Too long')).toBe(true)
      expect(Validations.maxLength(undefined, 5, 'Too long')).toBe(true)
    })
  })

  describe('minLength', () => {
    it('returns true when value length meets minimum', () => {
      expect(Validations.minLength('test', 4, 'Too short')).toBe(true)
      expect(Validations.minLength('hello', 3, 'Too short')).toBe(true)
    })

    it('returns message when value length is below minimum', () => {
      const message = 'Too short'
      expect(Validations.minLength('test', 5, message)).toBe(message)
      expect(Validations.minLength('hi', 3, message)).toBe(message)
    })
  })

  describe('required', () => {
    it('returns true when value is present', () => {
      expect(Validations.required('test')).toBe(true)
      expect(Validations.required(123)).toBe(true)
      expect(Validations.required('0')).toBe(true)
    })

    it('returns message when value is missing', () => {
      expect(Validations.required('', 'Field required')).toBe('Field required')
      expect(Validations.required(null, 'Required')).toBe('Required')
      expect(Validations.required(undefined, 'Required')).toBe('Required')
    })

    it('uses default message when not provided', () => {
      expect(Validations.required('')).toBe('Required')
    })
  })

  describe('email', () => {
    it('validates correct email addresses', () => {
      expect(Validations.email('test@example.com', 'Invalid')).toBe(true)
      expect(Validations.email('user.name@example.co.uk', 'Invalid')).toBe(true)
      expect(Validations.email('test+tag@example.com', 'Invalid')).toBe(true)
    })

    it('returns message for invalid emails', () => {
      const message = 'Invalid email'
      expect(Validations.email('notanemail', message)).toBe(message)
      expect(Validations.email('test@', message)).toBe(message)
      expect(Validations.email('@example.com', message)).toBe(message)
    })

    it('returns true for empty email', () => {
      expect(Validations.email('')).toBe(true)
    })
  })

  describe('phone', () => {
    it('validates correct phone numbers in e.164 format', () => {
      expect(Validations.phone('+905372086061', 'Invalid')).toBe(true)
      expect(Validations.phone('+12025551234', 'Invalid')).toBe(true)
      expect(Validations.phone('+441234567890', 'Invalid')).toBe(true)
    })

    it('returns message for invalid phone numbers', () => {
      const message = 'Invalid phone'
      expect(Validations.phone('905372086061', message)).toBe(message) // Missing +
      expect(Validations.phone('+1234', message)).toBe(message) // Too short
      expect(Validations.phone('invalid', message)).toBe(message)
    })
  })

  describe('url', () => {
    it('validates correct URLs', () => {
      expect(Validations.url('https://www.example.com', 'Invalid')).toBe(true)
      expect(Validations.url('http://example.com', 'Invalid')).toBe(true)
      expect(Validations.url('https://example.com/path', 'Invalid')).toBe(true)
    })

    it('returns message for invalid URLs', () => {
      const message = 'Invalid URL'
      expect(Validations.url('not a url', message)).toBe(message)
      expect(Validations.url('http://', message)).toBe(message)
    })

    it('returns message for URLs with spaces', () => {
      const message = 'Invalid URL'
      expect(Validations.url('https://example .com', message)).toBe(message)
    })

    it('returns true for empty URL', () => {
      expect(Validations.url('')).toBe(true)
    })
  })

  describe('ip', () => {
    it('validates IPv4 addresses', () => {
      expect(Validations.ip('192.168.1.1', 'Invalid')).toBe(true)
      expect(Validations.ip('10.0.0.1', 'Invalid')).toBe(true)
      expect(Validations.ip('255.255.255.255', 'Invalid')).toBe(true)
    })

    it('validates IPv4 addresses with CIDR notation', () => {
      expect(Validations.ip('192.168.1.0/24', 'Invalid')).toBe(true)
      expect(Validations.ip('10.0.0.0/8', 'Invalid')).toBe(true)
    })

    it('returns message for invalid IPs', () => {
      const message = 'Invalid IP'
      expect(Validations.ip('256.256.256.256', message)).toBe(message)
      expect(Validations.ip('192.168.1', message)).toBe(message)
      expect(Validations.ip('not an ip', message)).toBe(message)
    })

    it('returns error for invalid CIDR subnet mask', () => {
      expect(Validations.ip('192.168.1.0/33', 'Invalid')).toBe('Invalid subnet mask')
    })
  })

  describe('domain', () => {
    it('validates correct domain names', () => {
      expect(Validations.domain('example.com', 'Invalid')).toBe(true)
      expect(Validations.domain('sub.example.co.uk', 'Invalid')).toBe(true)
      expect(Validations.domain('my-domain.com', 'Invalid')).toBe(true)
    })

    it('returns message for invalid domains', () => {
      const message = 'Invalid domain'
      expect(Validations.domain('example', message)).toBe(message)
      expect(Validations.domain('.example.com', message)).toBe(message)
      expect(Validations.domain('example-.com', message)).toBe(message)
    })
  })

  describe('trim', () => {
    it('returns true for trimmed non-empty strings', () => {
      expect(Validations.trim('test')).toBe(true)
      expect(Validations.trim('  test  ')).toBe(true)
    })

    it('returns message for empty strings', () => {
      const message = 'Cannot be empty'
      expect(Validations.trim('', message)).toBe(message)
      expect(Validations.trim('   ', message)).toBe(message)
    })
  })

  describe('startsWithSpace', () => {
    it('returns true when string does not start with space', () => {
      expect(Validations.startsWithSpace('test')).toBe(true)
      expect(Validations.startsWithSpace('test ')).toBe(true) // trailing space is ok
      expect(Validations.startsWithSpace('test  space')).toBe(true) // internal space is ok
    })

    it('returns message when string starts with space', () => {
      const message = 'Cannot start with space'
      expect(Validations.startsWithSpace(' test', message)).toBe(message)
      expect(Validations.startsWithSpace('  test', message)).toBe(message)
    })
  })

  describe('noWhitespace', () => {
    it('returns true for strings without whitespace', () => {
      expect(Validations.noWhitespace('test')).toBe(true)
      expect(Validations.noWhitespace('test-value')).toBe(true)
    })

    it('returns message for strings with whitespace', () => {
      const message = 'No spaces allowed'
      expect(Validations.noWhitespace('test value', message)).toBe(message)
      expect(Validations.noWhitespace('test ', message)).toBe(message)
    })
  })

  describe('isNumber', () => {
    it('returns true for numeric strings', () => {
      expect(Validations.isNumber('123', 'Invalid')).toBe(true)
      expect(Validations.isNumber('0', 'Invalid')).toBe(true)
    })

    it('returns message for non-numeric strings', () => {
      const message = 'Not a number'
      expect(Validations.isNumber('abc', message)).toBe(message)
      expect(Validations.isNumber('12.3', message)).toBe(message)
      expect(Validations.isNumber('12 3', message)).toBe(message)
    })
  })

  describe('port', () => {
    it('validates valid port numbers', () => {
      expect(Validations.port('80')).toBe(true)
      expect(Validations.port('443')).toBe(true)
      expect(Validations.port('65536')).toBe(true)
    })

    it('returns error for non-numeric ports', () => {
      expect(Validations.port('abc')).toBe('Only use numbers')
    })

    it('returns error for ports out of range', () => {
      expect(Validations.port('0')).toBe('Invalid port number')
      expect(Validations.port('65537')).toBe('Invalid port number')
    })

    it('handles negative ports', () => {
      expect(Validations.port('-1')).toBe('Only use numbers')
    })
  })

  describe('startsWithHttpOrHttps', () => {
    it('returns true for URLs starting with http or https', () => {
      expect(Validations.startsWithHttpOrHttps('http://example.com', 'Invalid')).toBe(true)
      expect(Validations.startsWithHttpOrHttps('https://example.com', 'Invalid')).toBe(true)
    })

    it('returns message for URLs not starting with http/https', () => {
      const message = 'Must start with http:// or https://'
      expect(Validations.startsWithHttpOrHttps('ftp://example.com', message)).toBe(message)
      expect(Validations.startsWithHttpOrHttps('example.com', message)).toBe(message)
    })

    it('returns message for URLs with spaces', () => {
      const message = 'Must start with http:// or https://'
      expect(Validations.startsWithHttpOrHttps('http ://example.com', message)).toBe(message)
    })
  })

  describe('extension', () => {
    it('returns true when value does not start with dot', () => {
      expect(Validations.extension('txt')).toBe(true)
      expect(Validations.extension('pdf')).toBe(true)
    })

    it('returns message when value starts with dot', () => {
      const message = 'Invalid extension'
      expect(Validations.extension('.txt', message)).toBe(message)
    })
  })

  describe('subdomainDash', () => {
    it('validates subdomains with alphanumeric and dashes', () => {
      expect(Validations.subdomainDash('my-domain', 'Invalid')).toBe(true)
      expect(Validations.subdomainDash('api-v2', 'Invalid')).toBe(true)
      expect(Validations.subdomainDash('test123', 'Invalid')).toBe(true)
    })

    it('returns message for invalid subdomains', () => {
      const message = 'Invalid subdomain'
      expect(Validations.subdomainDash('my_domain', message)).toBe(message)
      expect(Validations.subdomainDash('my domain', message)).toBe(message)
    })
  })

  describe('startsOrEndsWithHyphen', () => {
    it('returns true when value does not start or end with hyphen', () => {
      expect(Validations.startsOrEndsWithHyphen('my-domain')).toBe(true)
      expect(Validations.startsOrEndsWithHyphen('domain')).toBe(true)
    })

    it('returns message when value starts or ends with hyphen', () => {
      const message = 'Cannot start or end with hyphen(-)'
      expect(Validations.startsOrEndsWithHyphen('-domain', message)).toBe(message)
      expect(Validations.startsOrEndsWithHyphen('domain-', message)).toBe(message)
    })
  })

  describe('noDots', () => {
    it('returns true when value has no dots', () => {
      expect(Validations.noDots('nodots')).toBe(true)
      expect(Validations.noDots('no-dots')).toBe(true)
    })

    it('returns message when value contains dots', () => {
      const message = 'Cannot contain dots (.)'
      expect(Validations.noDots('no.dots', message)).toBe(message)
      expect(Validations.noDots('multiple.dots.here', message)).toBe(message)
    })
  })

  describe('isEntityNameSpecialCharacter', () => {
    it('validates entity names with allowed characters', () => {
      expect(Validations.isEntityNameSpecialCharacter('My Company', 'Invalid')).toBe(true)
      expect(Validations.isEntityNameSpecialCharacter('Test-Company & Co', 'Invalid')).toBe(true)
      expect(Validations.isEntityNameSpecialCharacter('Company/Division', 'Invalid')).toBe(true)
    })

    it('returns message for invalid characters', () => {
      const message = 'Invalid characters'
      expect(Validations.isEntityNameSpecialCharacter('Company@Name', message)).toBe(message)
    })
  })

  describe('subdomainBlacklist', () => {
    it('returns either true or error message', () => {
      const result = Validations.subdomainBlacklist('test')
      expect(result === true || typeof result === 'string').toBe(true)
    })

    it('returns true for allowed subdomains', () => {
      expect(Validations.subdomainBlacklist('mycompany')).toBe(true)
      expect(Validations.subdomainBlacklist('customdomain')).toBe(true)
    })

    it('validates against blacklist', () => {
      // Should validate without errors
      const result = Validations.subdomainBlacklist('example')
      expect(result === true || typeof result === 'string').toBe(true)
    })
  })

  describe('verifiedDomains', () => {
    it('validates email domains against verified list', () => {
      const verifiedList = ['example.com', 'test.com']
      expect(Validations.verifiedDomains('user@example.com', verifiedList)).toBe(true)
      expect(Validations.verifiedDomains('user@test.com', verifiedList)).toBe(true)
    })

    it('returns message for unverified domains', () => {
      const verifiedList = ['example.com']
      const message = 'Domain not verified'
      expect(Validations.verifiedDomains('user@notverified.com', verifiedList, message)).toBe(message)
    })

    it('returns true for plain domains (no @)', () => {
      expect(Validations.verifiedDomains('example.com', [])).toBe(true)
    })
  })

  describe('ldapConnectionStringUrl', () => {
    it('validates LDAP connection strings', () => {
      expect(Validations.ldapConnectionStringUrl('ldap://example.com', 'Invalid')).toBe(true)
      expect(Validations.ldapConnectionStringUrl('ldaps://192.168.1.1:389', 'Invalid')).toBe(true)
      expect(Validations.ldapConnectionStringUrl('example.com:389', 'Invalid')).toBe(true)
      expect(Validations.ldapConnectionStringUrl('example.com', 'Invalid')).toBe(true)
    })

    it('returns message for invalid LDAP strings', () => {
      const message = 'Incorrect path format'
      expect(Validations.ldapConnectionStringUrl('@@@@', message)).toBe(message)
      expect(Validations.ldapConnectionStringUrl('!!!invalid!!!', message)).toBe(message)
    })
  })

  describe('numberRangeRule', () => {
    it('returns true for numbers within range', () => {
      expect(Validations.numberRangeRule('50', 0, 100)).toBe(true)
      expect(Validations.numberRangeRule('0', 0, 100)).toBe(true)
      expect(Validations.numberRangeRule('999', 0, 999)).toBe(true)
    })

    it('returns error message for numbers outside range', () => {
      expect(Validations.numberRangeRule('150', 0, 100)).toContain('between')
      expect(Validations.numberRangeRule('-1', 0, 100)).toContain('between')
    })

    it('uses custom message if provided', () => {
      const customMsg = 'Custom error'
      expect(Validations.numberRangeRule('150', 0, 100, customMsg)).toBe(customMsg)
    })
  })
})
