import {
  defaultDialogBoxSettings,
  defaultCommonSettings,
  deleteEmailOptions,
  checkDialogBoxSettings
} from '@/components/PhishingReporter/Settings/utils'

describe('PhishingReporter Settings utils', () => {
  it('exports default dialog and common settings', () => {
    expect(defaultDialogBoxSettings.languageName).toBe('English (United Kingdom)')
    expect(defaultCommonSettings.isConfirmationBeforeAnalysis).toBe(true)
    expect(deleteEmailOptions).toEqual([
      { text: 'with confirmation', value: false },
      { text: 'automatically', value: true }
    ])
  })

  it('validates dialog box settings', () => {
    expect(checkDialogBoxSettings(defaultDialogBoxSettings)).toBe(true)

    const invalid = { ...defaultDialogBoxSettings, msgBoxTitle: '' }
    expect(checkDialogBoxSettings(invalid)).toBe(false)

    const invalidConfirmation = {
      ...defaultDialogBoxSettings,
      isConfirmationBeforeAnalysis: true,
      analysisConfirmationMessage: ''
    }
    expect(checkDialogBoxSettings(invalidConfirmation)).toBe(false)
  })
})
