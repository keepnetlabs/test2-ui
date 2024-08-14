export const defaultDialogBoxSettings = {
  languageName: 'English',
  languageResourceId: '862249c19aad',
  msgBoxTitle: 'Phishing Reporter',
  msgBoxBtnCancelText: 'Cancel',
  analysisConfirmationMessage:
    'Do you want to report this email to the system administrator for analysis?',
  isConfirmationBeforeAnalysis: true,
  analysisEmailDeleteMessage: 'Do you wish to delete the original email from your inbox?',
  analysisThankYouMessage:
    'Thank you for reporting this email. Our organisation is more secure thanks to your actions. Please keep reporting suspicious emails.',
  isDeleteEmailBeforeAnalysis: true,
  deleteEmails: 1,
  msgBoxBtnYesText: 'Yes',
  msgBoxBtnNoText: 'No',
  msgBoxBtnOkText: 'Okay',
  emailSendingErrorMessage:
    'Report email cannot be sent to related department. Please try again later.',
  noInternetConnectionMessage:
    'Phishing Reporter add-in cannot connect to server. Please inform related department.',
  emailSelectionErrorMessage:
    'To report an email you must first select the email and then click the report button.',
  badFormatEmailMessage: 'Your selection is not a valid email message',
  isSendSimulationMails: true,
  simulationMailMessage:
    'This was a phishing simulation sent to by your cyber-security team. Thank you for your awareness and cautiousness.',
  isDefault: true
}

export const deleteEmailOptions = [
  { text: 'with confirmation', value: 1 },
  { text: 'automatically', value: 2 }
]

export const checkDialogBoxSettings = (settings) => {
  if (!settings.languageName) return false
  if (!settings.msgBoxTitle) return false
  if (!settings.msgBoxBtnYesText) return false
  if (!settings.msgBoxBtnNoText) return false
  if (!settings.msgBoxBtnCancelText) return false
  if (!settings.msgBoxBtnOkText) return false
  if (!settings.analysisThankYouMessage) return false
  if (!settings.noInternetConnectionMessage) return false
  if (!settings.emailSendingErrorMessage) return false
  if (!settings.emailSelectionErrorMessage) return false
  if (!settings.badFormatEmailMessage) return false
  if (settings.isConfirmationBeforeAnalysis && !settings.analysisConfirmationMessage) return false
  if (
    settings.isDeleteEmailBeforeAnalysis &&
    settings.deleteEmails === 1 &&
    !settings.analysisEmailDeleteMessage
  )
    return false
  if (settings.isSendSimulationMails && !settings.simulationMailMessage) return false
  return true
}
