import TabsWithMfaSettingsMultipleLanguages from '@/components/PhishingScenarios/TabsWithMfaSettingsMultipleLanguages.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

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
})
