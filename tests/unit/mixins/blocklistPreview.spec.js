jest.mock('@/api/domainBlocklist', () => ({
  getDomainBlocklistStatus: jest.fn()
}))

import blocklistPreview from '@/mixins/blocklistPreview'
import { getDomainBlocklistStatus } from '@/api/domainBlocklist'

const { computed, methods } = blocklistPreview
// ctx with the methods bound so `this.extractBlocklistDomain` resolves inside checkBlocklist
const ctx = (over = {}) => ({ blocklistWarning: null, ...methods, ...over })

describe('blocklistPreview mixin', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('blocklistWarningText', () => {
    it('is empty without a warning, and appends the guidance when present', () => {
      expect(computed.blocklistWarningText.call({ blocklistWarning: null })).toBe('')
      expect(computed.blocklistWarningText.call({ blocklistWarning: { reason: 'Flagged.' } })).toBe(
        'Flagged. Please use a clean domain before sending.'
      )
    })
    it('omits a missing reason instead of rendering the literal "undefined"', () => {
      expect(computed.blocklistWarningText.call({ blocklistWarning: { status: 'malicious' } })).toBe(
        'Please use a clean domain before sending.'
      )
    })
  })

  describe('extractBlocklistDomain', () => {
    it('parses the host, strips www, tolerates a missing protocol', () => {
      expect(methods.extractBlocklistDomain('https://www.evil.com/x?a=1')).toBe('evil.com')
      expect(methods.extractBlocklistDomain('evil.com/path')).toBe('evil.com')
    })
    it('returns null for empty / unparseable input', () => {
      expect(methods.extractBlocklistDomain('')).toBeNull()
      expect(methods.extractBlocklistDomain('http://')).toBeNull()
    })
  })

  describe('checkBlocklist', () => {
    it('flags a malicious domain (clearing any prior warning first)', async () => {
      getDomainBlocklistStatus.mockResolvedValue({ data: { status: 'malicious', reason: 'Bad.' } })
      const c = ctx({ blocklistWarning: { stale: true } })
      await methods.checkBlocklist.call(c, 'https://evil.com')
      expect(getDomainBlocklistStatus).toHaveBeenCalledWith('evil.com')
      expect(c.blocklistWarning).toEqual({ status: 'malicious', reason: 'Bad.' })
    })
    it('leaves no warning for a clean domain', async () => {
      getDomainBlocklistStatus.mockResolvedValue({ data: { status: 'clean' } })
      const c = ctx({ blocklistWarning: { stale: true } })
      await methods.checkBlocklist.call(c, 'https://good.com')
      expect(c.blocklistWarning).toBeNull()
    })
    it('does not call the worker for an empty/unparseable url', async () => {
      const c = ctx()
      await methods.checkBlocklist.call(c, '')
      expect(getDomainBlocklistStatus).not.toHaveBeenCalled()
      expect(c.blocklistWarning).toBeNull()
    })
    it('swallows worker errors without surfacing a warning', async () => {
      getDomainBlocklistStatus.mockRejectedValue(new Error('down'))
      const c = ctx()
      await methods.checkBlocklist.call(c, 'https://x.com')
      expect(c.blocklistWarning).toBeNull()
    })
  })
})
