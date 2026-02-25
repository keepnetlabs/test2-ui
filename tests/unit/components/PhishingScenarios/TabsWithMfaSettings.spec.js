import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

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
})
