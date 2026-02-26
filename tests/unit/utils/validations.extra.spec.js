import * as validations from '@/utils/validations'

describe('validations.js (extra coverage)', () => {
  it('numberRangeRule validates boundaries and bad values', () => {
    expect(validations.numberRangeRule('', 1, 10, 'Range Error')).toBe('Range Error')
    expect(validations.numberRangeRule(1, 1, 10)).toBe(true)
    expect(validations.numberRangeRule(10, 1, 10)).toBe(true)
    expect(validations.numberRangeRule(11, 1, 10, 'Range Error')).toBe('Range Error')
    expect(validations.numberRangeRule('abc', 1, 10)).toBe('Enter a number between 1 and 10')
  })

  it('verifiedDomains validates email domain membership', () => {
    const verified = ['keepnetlabs.com', 'company.org']
    expect(validations.verifiedDomains('alice@keepnetlabs.com', verified)).toBe(true)
    expect(
      validations.verifiedDomains('bob@unknown.com', verified, 'unverified domain')
    ).toBe('unverified domain')
    expect(validations.verifiedDomains('no-at-symbol', verified)).toBe(true)
  })

  it('ldapConnectionStringUrl validates ldap and ldaps url shapes', () => {
    expect(validations.ldapConnectionStringUrl('ldap://10.0.0.1:389')).toBe(true)
    expect(validations.ldapConnectionStringUrl('ldaps://my-server.domain.local:636')).toBe(true)
    expect(validations.ldapConnectionStringUrl('bad path', 'bad')).toBe('bad')
  })

  it('hyphen and dot related helpers enforce expected constraints', () => {
    expect(validations.startsOrEndsWithHyphen('sub-domain')).toBe(true)
    expect(validations.startsOrEndsWithHyphen('-subdomain', 'no hyphen edges')).toBe(
      'no hyphen edges'
    )
    expect(validations.startsOrEndsWithHyphen('subdomain-', 'no hyphen edges')).toBe(
      'no hyphen edges'
    )

    expect(validations.subdomainDash('abc-123')).toBe(true)
    expect(validations.subdomainDash('abc.def', 'invalid subdomain')).toBe('invalid subdomain')
    expect(validations.subdomainDashDot('abc.def-123')).toBe(true)
  })

  it('url and urlOrIpAddress branch coverage', () => {
    expect(validations.url('https://example.com')).toBe(true)
    expect(validations.url('invalid url', 'Bad URL')).toBe('Bad URL')
    expect(validations.url('has space in url', 'Invalid')).toBe('Invalid')
    expect(validations.url('', 'Empty')).toBe(true)
    expect(validations.url(null, 'Null')).toBe(true)

    expect(validations.urlOrIpAddress('https://site.com')).toBe(true)
    expect(validations.urlOrIpAddress('has space', 'No spaces')).toBe('No spaces')
    expect(validations.urlOrIpAddress('', 'Empty')).toBe(true)
  })

  it('getValue branch coverage for null and undefined', () => {
    expect(validations.getValue(null)).toBe('')
    expect(validations.getValue(undefined)).toBe('')
  })

  it('hasValue returns value when truthy, undefined when falsy', () => {
    expect(validations.hasValue('x')).toBe('x')
    expect(validations.hasValue(1)).toBe(1)
    expect(validations.hasValue([])).toEqual([])
    expect(validations.hasValue('')).toBeUndefined()
    expect(validations.hasValue(null)).toBeUndefined()
    expect(validations.hasValue(undefined)).toBeUndefined()
  })

  it('maxLength branch coverage', () => {
    expect(validations.maxLength('ab', 2)).toBe(true)
    expect(validations.maxLength('ab', 3)).toBe(true)
    expect(validations.maxLength('abc', 2, 'Too long')).toBe('Too long')
  })

  it('minLength branch coverage', () => {
    expect(validations.minLength('ab', 2)).toBe(true)
    expect(validations.minLength('abc', 2)).toBe(true)
    expect(validations.minLength('a', 2, 'Too short')).toBe('Too short')
  })

  it('startsWithHttpOrHttps branch coverage', () => {
    expect(validations.startsWithHttpOrHttps('http://example.com')).toBe(true)
    expect(validations.startsWithHttpOrHttps('https://example.com')).toBe(true)
    expect(validations.startsWithHttpOrHttps('ftp://example.com', 'Bad')).toBe('Bad')
    expect(validations.startsWithHttpOrHttps('has space', 'Spaces')).toBe('Spaces')
  })

  it('ip and ipv4Oripv6 branch coverage', () => {
    expect(validations.ip('192.168.1.1')).toBe(true)
    expect(validations.ip('192.168.1.0/24', 'Invalid')).toBe(true)
    expect(validations.ip('invalid', 'Bad IP')).toBe('Bad IP')

    expect(validations.ipv4Oripv6('192.168.1.1')).toBe(true)
    expect(validations.ipv4Oripv6('::1')).toBe(true)
  })

  it('urlWithPort branch coverage', () => {
    expect(validations.urlWithPort('https://example.com:8080')).toBe(true)
    expect(validations.urlWithPort('has space', 'Bad')).toBe('Bad')
    expect(validations.urlWithPort('', 'Empty')).toBe(true)
  })

  it('domain and extension branch coverage', () => {
    expect(validations.domain('example.com')).toBe(true)
    expect(validations.domain('invalid', 'Bad domain')).toBe('Bad domain')
    expect(validations.extension('txt')).toBe(true)
    expect(validations.extension('.txt', 'Must not start with dot')).toBe('Must not start with dot')
  })

  it('required and trim branch coverage', () => {
    expect(validations.required('x')).toBe(true)
    expect(validations.required('', 'Required')).toBe('Required')
    expect(validations.required(null, 'Required')).toBe('Required')
    expect(validations.trim('  x  ')).toBe(true)
    expect(validations.trim('   ', 'Empty')).toBe('Empty')
  })

  it('startsWith and startsWithSpace branch coverage', () => {
    expect(validations.startsWith('hello', 'Bad', 'hi')).toBe(true)
    expect(validations.startsWith('hello', 'Bad', 'he')).toBe('Bad')
    expect(validations.startsWithSpace('no leading space')).toBe(true)
    expect(validations.startsWithSpace(' has space', 'No space')).toBe('No space')
  })

  it('port branch coverage', () => {
    expect(validations.port('8080')).toBe(true)
    expect(validations.port('1')).toBe(true)
    expect(validations.port('65536')).toBe(true)
    expect(validations.port('0', 'Bad')).toBe('Invalid port number')
    expect(validations.port('99999')).toBe('Invalid port number')
    expect(validations.port('abc', 'Numbers only')).toBe('Numbers only')
  })

  it('noWhitespace and phone branch coverage', () => {
    expect(validations.noWhitespace('nospaces')).toBe(true)
    expect(validations.noWhitespace('has space', 'No spaces')).toBe('No spaces')
    expect(validations.phone('+12345678901')).toBe(true)
    expect(validations.phone('invalid', 'Bad phone')).toBe('Bad phone')
  })

  it('email and emailOrDomain branch coverage', () => {
    expect(validations.email('user@example.com')).toBe(true)
    expect(validations.email('', 'Empty')).toBe(true)
    expect(validations.email('bad', 'Invalid')).toBe('Invalid')
    expect(validations.emailOrDomain('example.com')).toBe(true)
    expect(validations.emailOrDomain('user@example.com')).toBe(true)
    expect(validations.emailOrDomain('', 'Empty')).toBe('Invalid domain')
  })

  it('isNumber and isDescriptionSpecialCharacter branch coverage', () => {
    expect(validations.isNumber('123')).toBe(true)
    expect(validations.isNumber('abc', 'Numbers only')).toBe('Numbers only')
    expect(validations.isDescriptionSpecialCharacter('valid text 123')).toBe(true)
    expect(validations.isDescriptionSpecialCharacter('invalid@', 'Bad')).toBe('Bad')
  })

  it('isNameSpecialCharacter and isEntityNameSpecialCharacter branch coverage', () => {
    expect(validations.isNameSpecialCharacter("O'Brien")).toBe(true)
    expect(validations.isNameSpecialCharacter('invalid123', 'Bad')).toBe('Bad')
    expect(validations.isEntityNameSpecialCharacter('Acme Corp')).toBe(true)
    expect(validations.isEntityNameSpecialCharacter('invalid@', 'Bad')).toBe('Bad')
  })

  it('isProxyAddressOrIp branch coverage', () => {
    expect(validations.isProxyAddressOrIp('192.168.1.1')).toBe(true)
    expect(validations.isProxyAddressOrIp('invalid@', 'Bad')).toBe('Bad')
  })

  it('isFileExtensionSpecialCharacter branch coverage', () => {
    expect(validations.isFileExtensionSpecialCharacter('txt')).toBe(true)
    expect(validations.isFileExtensionSpecialCharacter('invalid-', 'Bad')).toBe('Bad')
  })

  it('numberRangeRule empty string branch', () => {
    expect(validations.numberRangeRule('', 1, 10)).toBe('Enter a number between 1 and 10')
  })

  it('isDomainUrl branch coverage', () => {
    expect(validations.isDomainUrl('https://example.com')).toBe(true)
    expect(validations.isDomainUrl('invalid', 'Bad URL')).toBe('Bad URL')
  })

  it('isGsm7 and ldapConnectionStringUrl branch coverage', () => {
    expect(validations.isGsm7('Hello World')).toBe(true)
    expect(validations.isGsm7('Invalid \u0001', 'Bad')).toBe('Bad')
    expect(validations.ldapConnectionStringUrl('ldap://10.0.0.1:389')).toBe(true)
    expect(validations.ldapConnectionStringUrl('ldaps://server.local:636')).toBe(true)
    expect(validations.ldapConnectionStringUrl('!bad', 'Bad path')).toBe('Bad path')
  })

  it('verifiedDomains with @ extracts domain', () => {
    const verified = ['example.com']
    expect(validations.verifiedDomains('user@example.com', verified)).toBe(true)
    expect(validations.verifiedDomains('user@other.com', verified, 'Unverified')).toBe('Unverified')
  })

  it('subdomainBlacklist returns banned message when match', () => {
    const result = validations.subdomainBlacklist('google')
    expect(result).toContain('banned')
  })
  it('subdomainBlacklist returns true when no banned word', () => {
    expect(validations.subdomainBlacklist('myvalidsubdomain')).toBe(true)
  })

  it('subdomainDash and subdomainDashDot branch coverage', () => {
    expect(validations.subdomainDash('valid-123')).toBe(true)
    expect(validations.subdomainDash('invalid_underscore', 'Bad')).toBe('Bad')
    expect(validations.subdomainDashDot('valid.abc-123')).toBe(true)
    expect(validations.subdomainDashDot('invalid@', 'Bad')).toBe('Bad')
  })

  it('controlEmailLength and noDots validate edge conditions', () => {
    const longLeft = `${'a'.repeat(65)}@mail.com`
    const longRight = `a@${'b'.repeat(257)}.com`
    expect(validations.controlEmailLength(longLeft, 'too long')).toBe('too long')
    expect(validations.controlEmailLength(longRight, 'too long')).toBe('too long')
    expect(validations.controlEmailLength('a@b.com', 'too long')).toBe(true)

    expect(validations.noDots('nodots')).toBe(true)
    expect(validations.noDots('has.dot', 'no dots')).toBe('no dots')
  })

  it('isEmailSpecialCharacter validates allowed and disallowed sets', () => {
    expect(validations.isEmailSpecialCharacter('valid.email+tag@domain')).toBe(true)
    expect(validations.isEmailSpecialCharacter('invalid()email')).toBe(false)
  })

  it('isEmailChip returns specific message and updates chip style for single invalid item', () => {
    const chip = { style: { borderColor: '', color: '' } }
    const getElementsSpy = jest
      .spyOn(document, 'getElementsByClassName')
      .mockReturnValue([chip])

    const result = validations.isEmailChip(['invalid-email'])

    expect(result).toBe('invalid-email email address is not valid')
    expect(chip.style.borderColor).toBe('#ff5252')
    expect(chip.style.color).toBe('#ff5252')
    getElementsSpy.mockRestore()
  })

  it('isEmailChip returns true for empty values array', () => {
    expect(validations.isEmailChip([])).toBe(true)
  })
})
