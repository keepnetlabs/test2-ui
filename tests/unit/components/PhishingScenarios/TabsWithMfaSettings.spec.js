import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getDomainBlocklistStatus } from '@/api/domainBlocklist'

jest.mock('@/api/domainBlocklist', () => ({
  getDomainBlocklistStatus: jest.fn().mockResolvedValue({ data: {} })
}))

describe('TabsWithMfaSettings.vue', () => {
  it('getUrlTitle returns Phishing URL for PHISHING type', () => {
    const ctx = { type: PREVIEW_DIALOG_TYPES.PHISHING }
    expect(TabsWithMfaSettings.computed.getUrlTitle.call(ctx)).toBe('Phishing URL')
  })

  it('getUrlTitle returns Quishing URL for QUISHING type', () => {
    const ctx = { type: PREVIEW_DIALOG_TYPES.QUISHING }
    expect(TabsWithMfaSettings.computed.getUrlTitle.call(ctx)).toBe('Quishing URL')
  })

  it('getTextOfScenariosPage returns Phishing for PHISHING type', () => {
    const ctx = { type: PREVIEW_DIALOG_TYPES.PHISHING, isSmishing: false }
    expect(TabsWithMfaSettings.computed.getTextOfScenariosPage.call(ctx)).toBe('Phishing')
  })

  it('checkIsRedFlaggedTemplate returns true when html contains data-redflag', () => {
    expect(
      TabsWithMfaSettings.methods.checkIsRedFlaggedTemplate.call({}, '<div data-redflag>')
    ).toBe(true)
  })

  it('checkIsRedFlaggedTemplate returns false when html does not contain data-redflag', () => {
    expect(TabsWithMfaSettings.methods.checkIsRedFlaggedTemplate.call({}, '<div>test</div>')).toBe(
      false
    )
  })

  it('handleLanguageChange emits language-change', () => {
    const ctx = { internalLanguagePreview: '', $emit: jest.fn() }
    TabsWithMfaSettings.methods.handleLanguageChange.call(ctx, 'en')
    expect(ctx.$emit).toHaveBeenCalledWith('language-change', 'en')
    expect(ctx.internalLanguagePreview).toBe('en')
  })

  describe('Blocklist Warning', () => {
    const { methods } = TabsWithMfaSettings

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('extractDomain parses URL and strips www', () => {
      expect(methods.extractDomain('https://www.example.com/path')).toBe('example.com')
    })

    it('checkDomainBlocklist calls API with the landing page domain', () => {
      const ctx = {
        isBlocklistCheckEnabled: true,
        landingPageParams: { urlTemplate: 'https://www.test.com/login' },
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      methods.checkDomainBlocklist.call(ctx)
      expect(getDomainBlocklistStatus).toHaveBeenCalledWith('test.com')
    })

    it('checkDomainBlocklist sets warning for malicious domains', async () => {
      const ctx = {
        isBlocklistCheckEnabled: true,
        landingPageParams: { urlTemplate: 'https://malicious.com' },
        blocklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by browsers' }
      })
      await methods.checkDomainBlocklist.call(ctx)
      expect(ctx.blocklistWarning).toEqual({
        status: 'malicious',
        reason: 'Blocked by browsers'
      })
    })

    it('checkDomainBlocklist skips non-phishing contexts', () => {
      const ctx = {
        isBlocklistCheckEnabled: false,
        landingPageParams: { urlTemplate: 'https://test.com' },
        extractDomain: methods.extractDomain
      }
      methods.checkDomainBlocklist.call(ctx)
      expect(getDomainBlocklistStatus).not.toHaveBeenCalled()
    })
  })
})
