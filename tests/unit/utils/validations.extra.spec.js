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

  it('controlEmailLength and noDots validate edge conditions', () => {
    const longLeft = `${'a'.repeat(65)}@mail.com`
    const longRight = `a@${'b'.repeat(257)}.com`
    expect(validations.controlEmailLength(longLeft, 'too long')).toBe('too long')
    expect(validations.controlEmailLength(longRight, 'too long')).toBe('too long')
    expect(validations.controlEmailLength('a@b.com', 'too long')).toBe(true)

    expect(validations.noDots('nodots')).toBe(true)
    expect(validations.noDots('has.dot', 'no dots')).toBe('no dots')
  })
})
