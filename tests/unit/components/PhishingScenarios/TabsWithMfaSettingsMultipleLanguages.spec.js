import TabsWithMfaSettingsMultipleLanguages from '@/components/PhishingScenarios/TabsWithMfaSettingsMultipleLanguages.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getDomainBlocklistStatus } from '@/api/domainBlocklist'

jest.mock('@/api/domainBlocklist', () => ({
  getDomainBlocklistStatus: jest.fn().mockResolvedValue({ data: {} })
}))

describe('TabsWithMfaSettingsMultipleLanguages.vue', () => {
  it('getUrlTitle returns Phishing URL for PHISHING type', () => {
    const ctx = { type: PREVIEW_DIALOG_TYPES.PHISHING }
    expect(TabsWithMfaSettingsMultipleLanguages.computed.getUrlTitle.call(ctx)).toBe('Phishing URL')
  })

  it('isQuishing returns true for QUISHING type', () => {
    const ctx = { type: PREVIEW_DIALOG_TYPES.QUISHING }
    expect(TabsWithMfaSettingsMultipleLanguages.computed.isQuishing.call(ctx)).toBe(true)
  })

  it('checkIsRedFlaggedTemplate returns true when html contains data-redflag', () => {
    expect(
      TabsWithMfaSettingsMultipleLanguages.methods.checkIsRedFlaggedTemplate.call(
        {},
        '<div data-redflag>'
      )
    ).toBe(true)
  })

  it('handleEdit emits on-edit', () => {
    const ctx = { $emit: jest.fn() }
    TabsWithMfaSettingsMultipleLanguages.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit')
  })

  it('handleLanguageChange sets languagePreview', () => {
    const ctx = { languagePreview: '' }
    TabsWithMfaSettingsMultipleLanguages.methods.handleLanguageChange.call(ctx, 'en')
    expect(ctx.languagePreview).toBe('en')
  })

  describe('Blocklist Warning', () => {
    const { methods } = TabsWithMfaSettingsMultipleLanguages

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('extractDomain parses URL and strips www', () => {
      expect(methods.extractDomain('https://www.example.com/path')).toBe('example.com')
    })

    it('extractDomain handles URL without protocol', () => {
      expect(methods.extractDomain('example.com/path')).toBe('example.com')
    })

    it('extractDomain returns null for empty input', () => {
      expect(methods.extractDomain('')).toBeNull()
      expect(methods.extractDomain(null)).toBeNull()
    })

    it('checkDomainBlocklist calls API with correct domain', () => {
      const ctx = {
        phishingUrl: 'https://www.test.com/login',
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      methods.checkDomainBlocklist.call(ctx)
      expect(getDomainBlocklistStatus).toHaveBeenCalledWith('test.com')
    })

    it('checkDomainBlocklist sets warning for suspicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://suspicious.com',
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'suspicious', reason: 'Flagged by 2 vendors' }
      })
      await methods.checkDomainBlocklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toEqual({
        status: 'suspicious',
        reason: 'Flagged by 2 vendors'
      })
    })

    it('checkDomainBlocklist skips when phishingUrl is empty', () => {
      const ctx = { phishingUrl: '', blocklistWarning: null, extractDomain: methods.extractDomain }
      methods.checkDomainBlocklist.call(ctx)
      expect(getDomainBlocklistStatus).not.toHaveBeenCalled()
    })

    it('checkDomainBlocklist handles API errors silently', async () => {
      const ctx = {
        phishingUrl: 'https://error.com',
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlocklistStatus.mockRejectedValueOnce(new Error('Network'))
      await methods.checkDomainBlocklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('checkDomainBlocklist sets warning for malicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://malicious.com',
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by browsers' }
      })
      await methods.checkDomainBlocklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning.status).toBe('malicious')
    })

    it('checkDomainBlocklist ignores clean status', async () => {
      const ctx = {
        phishingUrl: 'https://clean.com',
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'clean', reason: null }
      })
      await methods.checkDomainBlocklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('extractDomain handles domain with hyphens', () => {
      expect(methods.extractDomain('https://www.insan-kaynaklari.me/path')).toBe('insan-kaynaklari.me')
    })

    it('extractDomain returns null for invalid input', () => {
      expect(methods.extractDomain('%%invalid%%')).toBeNull()
    })

    it('phishingUrl watch resets warning and rechecks', () => {
      const ctx = {
        blocklistWarning: { status: 'malicious', reason: 'old' },
        checkDomainBlocklist: jest.fn()
      }
      TabsWithMfaSettingsMultipleLanguages.watch.phishingUrl.call(ctx)
      expect(ctx.blocklistWarning).toBeNull()
      expect(ctx.checkDomainBlocklist).toHaveBeenCalled()
    })
  })
})
