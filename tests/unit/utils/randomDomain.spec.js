import {
  EXCLUDED_BLOCKLIST_STATUSES,
  buildBlocklistStatusMap,
  buildContentText,
  extractKeywords,
  tokenizeDomain,
  scoreDomain,
  isDomainEligible,
  rankDomains
} from '@/utils/randomDomain'

const domain = (value, text) => ({ value, text })

describe('randomDomain util', () => {
  describe('buildBlocklistStatusMap', () => {
    it('maps domain name (lowercased) to status', () => {
      const map = buildBlocklistStatusMap([
        { domain: 'Clean.com', status: 'clean' },
        { domain: 'bad.com', status: 'malicious' }
      ])
      expect(map).toEqual({ 'clean.com': 'clean', 'bad.com': 'malicious' })
    })

    it('returns an empty object for non-array / malformed input', () => {
      expect(buildBlocklistStatusMap(undefined)).toEqual({})
      expect(buildBlocklistStatusMap([null, { status: 'clean' }])).toEqual({})
    })
  })

  describe('buildContentText', () => {
    it('joins name, description, tags and page content', () => {
      const text = buildContentText({
        name: 'Acme Login',
        description: 'Payroll portal',
        tags: ['bank', 'hr'],
        landingPages: [{ content: '<h1>Sign in</h1>' }, { content: 'verify' }]
      })
      expect(text).toBe('Acme Login Payroll portal bank hr <h1>Sign in</h1> verify')
    })

    it('skips empty / missing fields without throwing', () => {
      expect(buildContentText({ name: 'Acme' })).toBe('Acme')
      expect(buildContentText({})).toBe('')
      expect(buildContentText()).toBe('')
    })
  })

  describe('extractKeywords', () => {
    it('strips HTML and entities, lowercases and dedupes', () => {
      const kw = extractKeywords('<h1>Acme&nbsp;Bank</h1> <p>ACME payroll</p>')
      expect(kw).toContain('acme')
      expect(kw).toContain('bank')
      expect(kw).toContain('payroll')
      // "acme" appears twice but must be unique
      expect(kw.filter((k) => k === 'acme')).toHaveLength(1)
    })

    it('drops stopwords, short tokens and pure numbers', () => {
      const kw = extractKeywords('Please login to your account 12345 hr')
      expect(kw).not.toContain('login') // stopword
      expect(kw).not.toContain('your') // stopword
      expect(kw).not.toContain('12345') // pure number
      expect(kw).not.toContain('hr') // < 3 chars
    })

    it('handles Turkish characters', () => {
      const kw = extractKeywords('Şirket içi güvenlik bildirimi')
      expect(kw).toContain('şirket')
      expect(kw).toContain('güvenlik')
      expect(kw).toContain('bildirimi')
    })

    it('returns [] for empty / non-string input', () => {
      expect(extractKeywords('')).toEqual([])
      expect(extractKeywords(null)).toEqual([])
      expect(extractKeywords(42)).toEqual([])
    })
  })

  describe('tokenizeDomain', () => {
    it('splits on separators and drops protocol + TLD', () => {
      expect(tokenizeDomain('https://secure-login.acme-bank.com')).toEqual([
        'secure',
        'login',
        'acme',
        'bank'
      ])
    })

    it('returns [] for invalid input', () => {
      expect(tokenizeDomain(undefined)).toEqual([])
      expect(tokenizeDomain('')).toEqual([])
    })
  })

  describe('scoreDomain', () => {
    it('scores exact token matches higher than partial ones', () => {
      const exact = scoreDomain('acme-portal.com', ['acme'])
      const partial = scoreDomain('acmecorp-portal.com', ['acme'])
      expect(exact.score).toBe(3)
      expect(partial.score).toBe(1)
      expect(exact.matched).toEqual(['acme'])
    })

    it('returns zero with no keywords or no tokens', () => {
      expect(scoreDomain('acme.com', [])).toEqual({ score: 0, matched: [] })
      expect(scoreDomain('', ['acme'])).toEqual({ score: 0, matched: [] })
    })
  })

  describe('isDomainEligible', () => {
    it('excludes malicious and suspicious domains', () => {
      expect(EXCLUDED_BLOCKLIST_STATUSES).toEqual(['malicious', 'suspicious'])
      const map = { 'bad.com': 'malicious', 'risky.com': 'suspicious', 'ok.com': 'clean' }
      expect(isDomainEligible(domain('1', 'bad.com'), map)).toBe(false)
      expect(isDomainEligible(domain('2', 'risky.com'), map)).toBe(false)
      expect(isDomainEligible(domain('3', 'ok.com'), map)).toBe(true)
    })

    it('treats unknown status as eligible', () => {
      expect(isDomainEligible(domain('1', 'unlisted.com'), {})).toBe(true)
    })

    it('rejects records without a name', () => {
      expect(isDomainEligible({}, {})).toBe(false)
    })
  })

  describe('rankDomains', () => {
    const pool = [
      domain('1', 'random-store.net'),
      domain('2', 'acme-bank-login.com'),
      domain('3', 'phishy.com')
    ]

    it('sorts eligible domains by semantic score and counts the excluded ones', () => {
      const { candidates, excludedCount } = rankDomains({
        domainRecords: pool,
        contentText: 'Acme Bank secure login',
        statusMap: { 'phishy.com': 'malicious' }
      })
      expect(excludedCount).toBe(1)
      expect(candidates.map((c) => c.text)).toEqual([
        'acme-bank-login.com', // highest score first
        'random-store.net'
      ])
      expect(candidates[0].matchedKeywords).toEqual(expect.arrayContaining(['acme', 'bank']))
    })

    it('keeps pool order for equal (zero) scores when content has no match', () => {
      const { candidates } = rankDomains({
        domainRecords: pool,
        contentText: '',
        statusMap: {}
      })
      expect(candidates.map((c) => c.text)).toEqual([
        'random-store.net',
        'acme-bank-login.com',
        'phishy.com'
      ])
    })

    it('returns no candidates when all are blacklisted', () => {
      const { candidates, excludedCount } = rankDomains({
        domainRecords: pool,
        statusMap: { 'random-store.net': 'malicious', 'acme-bank-login.com': 'suspicious', 'phishy.com': 'malicious' }
      })
      expect(candidates).toEqual([])
      expect(excludedCount).toBe(3)
    })
  })

})
