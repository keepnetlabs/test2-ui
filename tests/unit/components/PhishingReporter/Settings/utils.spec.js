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

  it('checkDialogBoxSettings returns false when required fields are missing', () => {
    expect(checkDialogBoxSettings({})).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, languageName: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, msgBoxBtnYesText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, msgBoxBtnNoText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, msgBoxBtnCancelText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, msgBoxBtnOkText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, analysisThankYouMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, noInternetConnectionMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, emailSendingErrorMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, emailSelectionErrorMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...defaultDialogBoxSettings, badFormatEmailMessage: '' })).toBe(false)
  })

  it('checkDialogBoxSettings returns false when delete email message missing', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(false)
  })

  it('checkDialogBoxSettings returns false when simulation mail message missing', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isSendSimulationMails: true,
      simulationMailMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(false)
  })

  it('checkDialogBoxSettings returns true when delete flow valid', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: 'Delete?'
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips confirmation check when isConfirmationBeforeAnalysis is false', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isConfirmationBeforeAnalysis: false,
      analysisConfirmationMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips delete message check when isDeleteEmailBeforeAnalysis is false', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isDeleteEmailBeforeAnalysis: false,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips delete message check when isDeleteWithoutConfirmation is true', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: true,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings returns true when isSendSimulationMails false', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isSendSimulationMails: false,
      simulationMailMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings returns true when simulation mail has message', () => {
    const settings = {
      ...defaultDialogBoxSettings,
      isSendSimulationMails: true,
      simulationMailMessage: 'Simulation message'
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })
})
