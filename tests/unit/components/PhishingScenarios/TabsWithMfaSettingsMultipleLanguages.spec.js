import TabsWithMfaSettingsMultipleLanguages from '@/components/PhishingScenarios/TabsWithMfaSettingsMultipleLanguages.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getDomainBlacklistStatus } from '@/api/domainBlacklist'

jest.mock('@/api/domainBlacklist', () => ({
  getDomainBlacklistStatus: jest.fn().mockResolvedValue({ data: {} })
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

  describe('Blacklist Warning', () => {
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

    it('checkDomainBlacklist calls API with correct domain', () => {
      const ctx = {
        phishingUrl: 'https://www.test.com/login',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      methods.checkDomainBlacklist.call(ctx)
      expect(getDomainBlacklistStatus).toHaveBeenCalledWith('test.com')
    })

    it('checkDomainBlacklist sets warning for suspicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://suspicious.com',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'suspicious', reason: 'Flagged by 2 vendors' }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toEqual({
        status: 'suspicious',
        reason: 'Flagged by 2 vendors'
      })
    })

    it('checkDomainBlacklist skips when phishingUrl is empty', () => {
      const ctx = { phishingUrl: '', blacklistWarning: null, extractDomain: methods.extractDomain }
      methods.checkDomainBlacklist.call(ctx)
      expect(getDomainBlacklistStatus).not.toHaveBeenCalled()
    })

    it('checkDomainBlacklist handles API errors silently', async () => {
      const ctx = {
        phishingUrl: 'https://error.com',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockRejectedValueOnce(new Error('Network'))
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toBeNull()
    })

    it('checkDomainBlacklist sets warning for malicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://malicious.com',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by browsers' }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning.status).toBe('malicious')
    })

    it('checkDomainBlacklist ignores clean status', async () => {
      const ctx = {
        phishingUrl: 'https://clean.com',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'clean', reason: null }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toBeNull()
    })

    it('extractDomain handles domain with hyphens', () => {
      expect(methods.extractDomain('https://www.insan-kaynaklari.me/path')).toBe('insan-kaynaklari.me')
    })

    it('extractDomain returns null for invalid input', () => {
      expect(methods.extractDomain('%%invalid%%')).toBeNull()
    })

    it('phishingUrl watch resets warning and rechecks', () => {
      const ctx = {
        blacklistWarning: { status: 'malicious', reason: 'old' },
        checkDomainBlacklist: jest.fn()
      }
      TabsWithMfaSettingsMultipleLanguages.watch.phishingUrl.call(ctx)
      expect(ctx.blacklistWarning).toBeNull()
      expect(ctx.checkDomainBlacklist).toHaveBeenCalled()
    })
  })
})
