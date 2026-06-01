import {
  defaultDialogBoxSettings,
  defaultCommonSettings,
  deleteEmailOptions,
  checkDialogBoxSettings
} from '@/components/PhishingReporter/Settings/utils'

const validBaseSettings = { ...defaultDialogBoxSettings, brandName: 'Acme' }

describe('PhishingReporter Settings utils', () => {
  it('exports default dialog and common settings', () => {
    expect(defaultDialogBoxSettings.languageName).toBe('English (United Kingdom)')
    expect(defaultDialogBoxSettings.addInName).toBeTruthy()
    expect(defaultDialogBoxSettings.description).toBeTruthy()
    expect(defaultCommonSettings.isConfirmationBeforeAnalysis).toBe(true)
    expect(deleteEmailOptions).toEqual([
      { text: 'with confirmation', value: false },
      { text: 'automatically', value: true }
    ])
  })

  it('validates dialog box settings', () => {
    expect(checkDialogBoxSettings(validBaseSettings)).toBe(true)

    const invalid = { ...validBaseSettings, msgBoxTitle: '' }
    expect(checkDialogBoxSettings(invalid)).toBe(false)

    const invalidConfirmation = {
      ...validBaseSettings,
      isConfirmationBeforeAnalysis: true,
      analysisConfirmationMessage: ''
    }
    expect(checkDialogBoxSettings(invalidConfirmation)).toBe(false)
  })

  it('checkDialogBoxSettings returns false when manifest locale fields are missing', () => {
    expect(checkDialogBoxSettings({ ...validBaseSettings, addInName: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, brandName: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, description: '' })).toBe(false)
  })

  it('checkDialogBoxSettings returns false when required fields are missing', () => {
    expect(checkDialogBoxSettings({})).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, languageName: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, msgBoxBtnYesText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, msgBoxBtnNoText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, msgBoxBtnCancelText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, msgBoxBtnOkText: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, analysisThankYouMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, noInternetConnectionMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, emailSendingErrorMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, emailSelectionErrorMessage: '' })).toBe(false)
    expect(checkDialogBoxSettings({ ...validBaseSettings, badFormatEmailMessage: '' })).toBe(false)
  })

  it('checkDialogBoxSettings returns false when delete email message missing', () => {
    const settings = {
      ...validBaseSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(false)
  })

  it('checkDialogBoxSettings returns false when simulation mail message missing', () => {
    const settings = {
      ...validBaseSettings,
      isSendSimulationMails: true,
      simulationMailMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(false)
  })

  it('checkDialogBoxSettings returns true when delete flow valid', () => {
    const settings = {
      ...validBaseSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: 'Delete?'
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips confirmation check when isConfirmationBeforeAnalysis is false', () => {
    const settings = {
      ...validBaseSettings,
      isConfirmationBeforeAnalysis: false,
      analysisConfirmationMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips delete message check when isDeleteEmailBeforeAnalysis is false', () => {
    const settings = {
      ...validBaseSettings,
      isDeleteEmailBeforeAnalysis: false,
      isDeleteWithoutConfirmation: false,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings skips delete message check when isDeleteWithoutConfirmation is true', () => {
    const settings = {
      ...validBaseSettings,
      isDeleteEmailBeforeAnalysis: true,
      isDeleteWithoutConfirmation: true,
      analysisEmailDeleteMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings returns true when isSendSimulationMails false', () => {
    const settings = {
      ...validBaseSettings,
      isSendSimulationMails: false,
      simulationMailMessage: ''
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })

  it('checkDialogBoxSettings returns true when simulation mail has message', () => {
    const settings = {
      ...validBaseSettings,
      isSendSimulationMails: true,
      simulationMailMessage: 'Simulation message'
    }
    expect(checkDialogBoxSettings(settings)).toBe(true)
  })
})
